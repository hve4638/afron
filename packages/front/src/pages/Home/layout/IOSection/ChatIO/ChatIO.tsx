import { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';

import useTrigger from '@/hooks/useTrigger';

import { Grid } from '@/components/layout';

import { useConfigStore, useSessionStore } from '@/stores';

import ChatDiv from './ChatDiv';
import { useHistoryStore } from '@/stores/useHistoryStore';
import InfiniteScroll from '@/components/InfiniteScroll';
import { HistoryData } from '@/features/session-history';
import useCache from '@/hooks/useCache';
import { useEvent } from '@/hooks/useEvent';

import { CommonProps } from '@/types';
import ChatInput from './ChatInput';

import styles from './ChatIO.module.scss';
import useChatIO from './ChatIO.hook';

interface ChatIOLayoutProps extends CommonProps {
    inputText: string;
    onChangeInputText: (text: string) => void;

    color: string;
    tokenCount?: number;
}

function ChatIO({
    className = '',
    style = {},
    inputText,
    onChangeInputText,

    color,
    tokenCount = 0,
}: ChatIOLayoutProps) {
    const [_, refresh] = useTrigger();
    const {
        ref: { scrollAnchorRef },
        state: { chats, fontSize, hasMore },
        emit,
    } = useChatIO({ refreshTrigger: refresh });

    return (
        <Grid
            className={
                classNames(
                    className,
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
                ...style,
            }}
            rows='minmax(0, 1fr) 0.25em 8em'
            columns='1fr'
        >
            <InfiniteScroll
                className={classNames(styles['chat-list'])}
                style={{
                    width: '100%',
                    height: '100%',
                    minHeight: '0',
                }}
                loadMore={() => {
                    emit('load_more_history');
                }}
                hasMore={hasMore}
            >
                <div
                    className={classNames(styles['chat-container'])}
                    style={{
                        fontSize: `${fontSize}px`,
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

export default ChatIO;