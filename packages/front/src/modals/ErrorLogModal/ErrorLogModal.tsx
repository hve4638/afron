import { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';

import { Modal, ModalHeader } from '@/features/modal';
import ListView from '@/components/container/ListView/ListView';

import useHotkey from '@/hooks/useHotkey';
import useModalDisappear from '@/hooks/useModalDisappear';

import useErrorLogStore, { LogEntry } from '@/stores/useErrorLogStore';

import LogEntryItem from './LogEntryItem';

type ErrorLogModalProps = {
    errorId: string | null;
}

function ErrorLogModal({
    errorId,
}: ErrorLogModalProps) {
    const scrollAnchorRef = useRef<HTMLDivElement>(null);
    const initOpenRef = useRef<HTMLDivElement>(null);
    const { log: errorLog, markAsRead, hasUnread } = useErrorLogStore();

    if (hasUnread) {
        markAsRead();
    }

    useEffect(() => {
        initOpenRef.current?.scrollIntoView();
    }, []);

    return (
        <Modal
            style={{
                height: '60%'
            }}
            header={{
                label: '에러',
                showCloseButton: true,
            }}
            allowEscapeKey={true}
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