import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { useInView } from 'react-intersection-observer';

import useLazyThrottle from '@/hooks/useLazyThrottle';
import useTrigger from '@/hooks/useTrigger';

import InputField from '@/components/InputField';
import { GIconButton, GoogleFontIcon } from '@/components/GoogleFontIcon';
import { Align, Column, Flex, Grid, Row } from '@/components/layout';

import { useConfigStore, useSessionStore } from '@/stores';

import SplitSlider from '../SplitSlider';

import styles from './styles.module.scss';
import ChatDiv from './ChatDiv';
import { useHistoryStore } from '@/stores/useHistoryStore';
import InfiniteScroll from '@/components/InfiniteScroll';
import { HistoryData } from '@/features/session-history';
import useMemoRef from '@/hooks/useMemoRef';
import { checksum } from '@/utils/debug';
import useCache from '@/hooks/useCache';
import FilesFormLayout from './FilesUpload/FileList';
import { FileDropper } from './FilesUpload';
import { useEvent } from '@/hooks/useEvent';

// const InfiniteLoader = RawInfiniteLoader as unknown as React.ComponentType<any>;

type ChatIOLayoutProps = {
    inputText: string;
    onChangeInputText: (text: string) => void;

    color: string;
    tokenCount?: number;
}

function ChatIOLayout({
    inputText,
    onChangeInputText,

    color,
    tokenCount = 0,
}: ChatIOLayoutProps) {
    const [_, refresh] = useTrigger();
    const { font_size } = useConfigStore();
    const lastSessionId = useSessionStore(state => state.deps.last_session_id);
    const sessionHistory = useMemo(() => {
        const historyState = useHistoryStore.getState();

        if (lastSessionId) {
            return historyState.get(lastSessionId);
        }
        else {
            return null;
        }
    }, [lastSessionId]);
    const scrollAnchorRef = useRef<HTMLDivElement>(null);

    const [nextOffset, setNextOffset] = useState(0);
    const [limit, setLimit] = useState(32);
    const [hasMore, setHasMore] = useState(true);

    const historyData = useCache<{ current: HistoryData[] }>(() => ({ current: [] }), [lastSessionId]);
    const chats = useMemo(() => {
        return historyData.current.flatMap((item) => {
            const chat: { side: 'input' | 'output', value: string, key: string, data: HistoryData }[] = [];
            if (item.output) {
                chat.push({ side: 'output', value: item.output, key: `${item.id}_output`, data: item });
            }
            if (item.input) {
                chat.push({ side: 'input', value: item.input, key: `${item.id}_input`, data: item });
            }
            return chat;
        }).reverse();
    }, [historyData.current])

    useEffect(() => {
        setHasMore(true);
        setNextOffset(0);
        window.setTimeout(
            () => {
                console.log('scroll to anchor', scrollAnchorRef.current);
                scrollAnchorRef.current?.scrollIntoView();
            },
            1,
        )
    }, [lastSessionId, scrollAnchorRef.current]);

    useEvent('refresh_chat', async () => {
        if (!sessionHistory) return;

        await loadHistory();
        window.setTimeout(
            () => scrollAnchorRef.current?.scrollIntoView(), 1
        );
    }, [lastSessionId, sessionHistory]);
    useEvent('refresh_chat_without_scroll', async () => {
        if (!sessionHistory) return;

        await loadHistory();
    }, [lastSessionId, sessionHistory]);

    const loadHistory = async () => {
        if (!sessionHistory) {
            setHasMore(false);
            return;
        }

        const prev = await sessionHistory.select(0, limit, true);
        if (prev.length < limit) {
            setHasMore(false);
        }

        historyData.current = prev;
        refresh();
    }

    const loadMore = async () => {
        if (!hasMore) return;

        await loadHistory();
        setLimit(limit * 2);
    }

    return (
        <Grid
            className={
                classNames(
                    styles['main-section'],
                    'row',
                    'body',
                    'relative',
                    `palette-${color}`
                )
            }
            style={{
                width: '100%',
                height: '100%',
                overflowY: 'hidden',
                paddingTop: '0.5em',
            }}
            rows='minmax(0, 1fr) 0.25em 8em'
            columns='1fr'
        >
            <InfiniteScroll
                style={{
                    width: '100%',
                    height: '100%',
                    minHeight: '0',
                }}
                loadMore={() => loadMore()}
                hasMore={hasMore}
            >
                <div
                    className={classNames(styles['chat-container'])}
                    style={{
                        fontSize: `${font_size}px`,
                        overflowY: 'auto',
                        display: 'block',
                    }}
                >
                    {
                        chats.map((c, index) => (
                            <ChatDiv
                                key={c.key}
                                style={{
                                    marginBottom: '0.5em',
                                }}

                                side={c.side}
                                value={c.value}
                                data={c.data}
                            />
                        ))
                    }
                    <div className='anchor' ref={scrollAnchorRef} />
                </div>
            </InfiniteScroll>
            <div />
            <ChatInput
                value={inputText}
                onChange={(value) => onChangeInputText(value)}
                tokenCount={tokenCount}
            />
        </Grid>
    )
}

type ChatInputProps = {
    value?: string;
    onChange?: (value: string) => void;

    tokenCount?: number;
}

function ChatInput({
    value = '',
    onChange = () => { },
    tokenCount = 0,
}: ChatInputProps) {
    const sessionState = useSessionStore();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { font_size } = useConfigStore();
    const [draggingFile, setDraggingFile] = useState(false);

    return (
        <div
            className={classNames(styles['chat-input-container'])}
            onClick={(e) => {
                textareaRef.current?.focus();
            }}
        >
            <Grid
                className={classNames(styles['chat-input'])}
                rows='1fr 1.75em'
                columns='1fr'
                onDragEnter={(e) => {
                    setDraggingFile(true);
                }}

                onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            >
                <textarea
                    ref={textareaRef}
                    style={{
                        fontSize: `${font_size}px`,
                    }}
                    spellCheck='false'
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    tabIndex={0}
                ></textarea>
                <Row
                    style={{
                        fontSize: '1.75em',
                        gap: '0.25em',
                    }}
                    columnAlign={Align.End}
                >
                    <span
                        className={classNames(styles['token-count'], 'undraggable')}
                        style={{
                            paddingLeft: '0.25em',
                        }}
                    >
                        token: {tokenCount}
                    </span>
                    <Flex style={{ height: '100%', }}>
                        <FilesFormLayout
                            style={{
                                height: '100%',
                                padding: '0px',
                            }}
                            internalPadding='4px 4px'
                        />
                    </Flex>
                    <GIconButton
                        className={classNames(styles['send-button'])}
                        value='send'
                        onClick={(e) => {
                            sessionState.actions.request();

                            e.stopPropagation();
                        }}
                    />
                </Row>
                {
                    draggingFile &&
                    <FileDropper
                        onDragEnd={() => {
                            console.log('drag end');
                            setDraggingFile(false);
                        }}
                    />
                }
            </Grid>
        </div>
    )
}

export default ChatIOLayout;