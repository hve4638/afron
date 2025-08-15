import { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';

import { Align, Column, Flex, Grid, Row } from '@/components/layout';

import { useConfigStore, useSessionStore } from '@/stores';

import FilesFormLayout from '../FilesUpload/FileList';
import { FileDropper } from '../FilesUpload';

import { TokenCount, RequestButton, PreviewButton, AttachFileButton } from '../ui';

import styles from './ChatIO.module.scss';
import { readImageFromClipboard } from '@/utils/clipboard';
import Latch from '@/lib/Latch';
import { emitEvent } from '@/hooks/useEvent';

type ChatInputProps = {
    value?: string;
    onChange?: (value: string) => void;

    tokenCount?: number;
}

function ChatInput({
    value = '',
    onChange = () => { },
}: ChatInputProps) {
    const showtokenCount = useConfigStore(state => state.show_token_count);
    const promptPreviewEnabled = useConfigStore(state => state.prompt_preview_enabled);
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
                className={
                    classNames(styles['chat-input'])
                }
                rows='1fr 1.75em'
                columns='1fr'
                onDragEnter={(e) => {
                    if (e.dataTransfer?.types?.[0] === 'Files') {
                        setDraggingFile(true);
                    }
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
                    tabIndex={0}
                    onChange={(e) => onChange(e.target.value)}
                    onPaste={(e) => {
                        const data = readImageFromClipboard(e);
                        if (!data.isImage) return;

                        emitEvent('input_file_upload', {
                            file: data.file,
                            latch: new Latch(),
                        });
                        e.preventDefault();
                    }}
                ></textarea>
                <Row
                    style={{
                        position: 'relative',
                        fontSize: '1.75em',
                        gap: '0.25em',
                        // height: '40px',
                    }}
                    columnAlign={Align.End}
                >
                    <AttachFileButton />
                    <Flex style={{
                        // height: '100%',
                        height: '40px',
                    }}>
                        <FilesFormLayout
                            style={{
                                height: '100%',
                                padding: '0px',
                            }}
                            internalPadding='4px 4px'
                        />
                    </Flex>
                    {
                        promptPreviewEnabled &&
                        <PreviewButton />
                    }
                    <RequestButton />
                    {
                        showtokenCount &&
                        <TokenCount
                            className={classNames('undraggable')}
                            style={{
                                position: 'absolute',
                                left: '0',
                                bottom: 'calc(100% + 1em + 6px)',
                                height: '1em',
                                padding: '0 0.2em',
                            }}
                        />
                    }
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

export default ChatInput;