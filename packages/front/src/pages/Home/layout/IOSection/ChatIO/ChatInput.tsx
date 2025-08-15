import { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';

import { Align, Column, Flex, Grid, Row } from '@/components/layout';

import { useConfigStore, useSessionStore } from '@/stores';

import FilesFormLayout from '../FilesUpload/FileList';
import { FileDropper } from '../FilesUpload';

import { TokenCount, RequestButton, PreviewButton } from '../ui';

import styles from './ChatIO.module.scss';

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
                    {
                        showtokenCount &&
                        <TokenCount
                            className={classNames('undraggable')}
                            style={{
                                paddingLeft: '0.25em',
                            }}
                        />
                    }
                    <Flex style={{ height: '100%', }}>
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