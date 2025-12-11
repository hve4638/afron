import { useEffect, useRef} from 'react';

import { Modal} from '@/features/modal';
import ListView from '@/components/container/ListView/ListView';

import useErrorLogStore from '@/stores/useErrorLogStore';

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