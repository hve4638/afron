import { useMemo, useRef, useState } from 'react';
import classNames from 'classnames';

import InputField from './InputField';
import { Align, Flex, Grid, Row } from '@/components/layout';

import { useConfigStore, useSessionStore } from '@/stores';

import { SplitSlider } from '../../SplitSlider';

import { useHistoryStore } from '@/stores/useHistoryStore';
import { HistoryData } from '@/features/session-history';
import { remapDecimal } from '@/utils/math';
import FilesFormLayout from '../FilesUpload/FileList';
import { FileDropper } from '../FilesUpload';
import ProfileEvent from '@/features/profile-event';
import { emitEvent, useEvent } from '@/hooks/useEvent';
import {
    TokenCount,
    MarkdownButton,
    AttachFileButton,
    RequestButton,
    PreviewButton,
    CopyButton,
} from '../ui';

import { CommonProps } from '@/types';

import styles from './SingleIO.module.scss';
import { readImageFromClipboard } from '@/utils/clipboard';
import Latch from '@/lib/Latch';

interface SingleIOLayoutProps extends CommonProps {
    inputText: string;
    onChangeInputText: (text: string) => void;

    color: string;
}

/// @TODO: 너무 복잡해서 코드 정리한 후 기능 부분은 .hook.ts로 분리하기
function SingleIO({
    className = '',
    style = {},
    inputText,
    onChangeInputText,
    color,
}: SingleIOLayoutProps) {
    const configState = useConfigStore();
    const sessionState = useSessionStore();
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
    const [last, setLast] = useState<HistoryData | null>(null);
    const [draggingFile, setDraggingFile] = useState(false);
    const outputModelName = useMemo(() => {
        if (last === null) return '';

        return ProfileEvent.model.getName(last.modelId);
    }, [last?.modelId]);

    const [left, right] = useConfigStore(state => state.textarea_io_ratio);

    const textareaSectionRef = useRef<HTMLDivElement>(null);

    const textAreaBorderRadius = useMemo(() => {
        const radius = remapDecimal(configState.textarea_padding, { min: 4, max: 16 }, { min: 1, max: 5 });
        return `${radius}px`;
    }, [configState.textarea_padding]);

    const gridWH = useMemo(() => {
        const sub = '1fr';
        const main = `${left}fr ${right}fr`

        if (configState.layout_mode == 'horizontal') {
            return { rows: sub, columns: main }
        }
        else if (configState.layout_mode == 'vertical') {
            return { rows: main, columns: sub }
        }
        else {
            return { rows: sub, columns: main }
        }
    }, [configState.layout_mode, left, right]);

    const textareaPadding = configState.textarea_padding;
    const calcPadding = (side: 'left' | 'right' | 'top' | 'down') => {
        const pad = configState.textarea_padding;

        switch (side) {
            case 'left':
                return [8, pad / 2, pad, pad] as [number, number, number, number];
            case 'right':
                return [8, pad, pad, pad / 2] as [number, number, number, number];
            case 'top':
                return [8, pad, pad / 2, pad] as [number, number, number, number];
            case 'down':
                return [pad / 2, pad, pad, pad] as [number, number, number, number];
        }
    };

    const layoutMode = configState.layout_mode;
    const inputMargin = useMemo(() => {
        const m = (
            layoutMode === 'horizontal'
                ? calcPadding('left')
                : calcPadding('top')
        );
        return `${m[0]}px ${m[1]}px ${m[2]}px ${m[3]}px`;
    }, [configState.layout_mode, textareaPadding]);
    const outputMargin = useMemo(() => {
        const m = (
            layoutMode === 'horizontal'
                ? calcPadding('right')
                : calcPadding('down')
        );
        return `${m[0]}px ${m[1]}px ${m[2]}px ${m[3]}px`;
    }, [configState.layout_mode, textareaPadding]);

    useEvent('refresh_chat', async () => {
        if (!sessionHistory) return;

        const prev = await sessionHistory.select(0, 1, true);
        if (prev.length === 0) {
            setLast(null);
        }
        else {
            setLast(prev[0]);
        }
    }, [lastSessionId]);

    return (
        <>
            <Grid
                ref={textareaSectionRef}
                className={
                    classNames(
                        className,
                        'row',
                        'flex',
                        'body',
                        'relative',
                        `palette-${color}`
                    )
                }
                style={{
                    overflow: 'hidden',
                    fontSize: `${configState.font_size}px`,
                    ...style,
                }}
                rows={gridWH.rows}
                columns={gridWH.columns}
            >
                <InputField
                    className={
                        classNames(
                            'flex',
                        )
                    }
                    style={{
                        zIndex: 0,
                        margin: inputMargin,
                        borderRadius: textAreaBorderRadius,
                        paddingBottom: '60px',
                    }}
                    text={inputText}
                    onChange={(text: string) => onChangeInputText(text)}
                    onDragEnter={(e) => {
                        console.log(e);
                        setDraggingFile(true);
                    }}

                    onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    onPaste={(e) => {
                        const data = readImageFromClipboard(e);
                        if (!data.isImage) return;

                        emitEvent('input_file_upload', {
                            file: data.file,
                            latch: new Latch(),
                        });
                        e.preventDefault();
                    }}
                >
                    {
                        configState.show_token_count &&
                        <TokenCount
                            style={{
                                position: 'absolute',
                                left: '0',
                                bottom: '0',
                                height: 'calc(70px + 1em)',
                                padding: '10px',
                            }}
                        />
                    }
                    <Row
                        style={{
                            position: 'absolute',
                            left: '0',
                            bottom: '0',
                            width: '100%',
                            height: '60px',
                            padding: '10px',
                            gap: '0.5em',
                        }}
                        columnAlign={Align.End}
                    >
                        <AttachFileButton />
                        <Flex
                            style={{
                                height: '100%',
                            }}
                        >
                            <FilesFormLayout
                                style={{
                                    height: '100%',
                                }}
                                internalPadding='4px 4px'
                            />
                        </Flex>
                        {
                            configState.prompt_preview_enabled &&
                            <PreviewButton />
                        }
                        <RequestButton />
                    </Row>
                    {
                        draggingFile &&
                        <FileDropper
                            onDragEnd={() => {
                                setDraggingFile(false);
                            }}
                        />
                    }
                </InputField>
                <InputField
                    className={
                        classNames(
                            'flex',
                            // styles['shadow-short'],
                        )
                    }
                    style={{
                        zIndex: 0,
                        margin: outputMargin,
                        borderRadius: textAreaBorderRadius,
                    }}
                    text={sessionState.output ?? ''}
                    onChange={() => { }}
                    tabIndex={-1}
                    markdown={sessionState.markdown}
                >
                    {
                        last !== null &&
                        <small
                            className={classNames(styles['output-info-button'], 'secondary-color', 'undraggable')}
                            style={{
                                position: 'absolute',
                                left: '10px',
                                bottom: '10px',
                                cursor: 'pointer',
                                padding: '0em 0.4em',
                                fontSize: '0.8rem',
                            }}
                        >{outputModelName}</small>
                    }
                    <Row
                        className={classNames('undraggable')}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            bottom: '10px',
                            fontSize: '1rem',
                            gap: '0.25rem',
                        }}
                    >
                        <MarkdownButton
                            value={sessionState.markdown}
                            onChange={(next) => {
                                sessionState.update.markdown(next);
                            }}
                        />
                        <CopyButton />
                    </Row>
                </InputField>
                <SplitSlider
                    targetRef={textareaSectionRef}
                />
            </Grid>
        </>
    )
}

export default SingleIO;