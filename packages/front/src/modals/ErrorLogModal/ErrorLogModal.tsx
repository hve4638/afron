import { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';

import { Modal, ModalHeader } from '@/components/Modal';
import ListView from '@/components/container/ListView/ListView';

import useHotkey from '@/hooks/useHotkey';
import useModalDisappear from '@/hooks/useModalDisappear';

import useErrorLogStore, { LogEntry } from '@/stores/useErrorLogStore';

import LogEntryItem from './LogEntryItem';

type ErrorLogModalProps = {
    errorId: string | null;
    isFocused: boolean;
    onClose: () => void;
}

function ErrorLogModal({
    errorId,
    isFocused,
    onClose
}: ErrorLogModalProps) {
    const [disappear, close] = useModalDisappear(onClose);
    const scrollAnchorRef = useRef<HTMLDivElement>(null);
    const initOpenRef = useRef<HTMLDivElement>(null);
    const { log: errorLog, markAsRead, hasUnread } = useErrorLogStore();

    useHotkey({
        'Escape': close,
    }, isFocused, []);

    if (hasUnread) {
        markAsRead();
    }

    useEffect(() => {
        initOpenRef.current?.scrollIntoView();
    }, []);

    return (
        <Modal
            disappear={disappear}
            style={{
                height: '60%'
                // minHeight: '60%',
                // maxHeight: '80%',
            }}
            headerLabel={
                <ModalHeader onClose={close}>에러</ModalHeader>
            }
        >
            <ListView
                style={{
                    height: '100%'
                }}
            >
                <div ref={scrollAnchorRef} />
                {
                    errorLog.map((entry, index) => (
                        <LogEntryItem
                            ref={
                                errorId === entry.id
                                    ? initOpenRef
                                    : null
                            }
                            key={index}
                            entry={entry}
                            showDetailWhenRender={errorId === entry.id}
                        />
                    ))
                }
            </ListView>
        </Modal>
    );
}

export default ErrorLogModal;