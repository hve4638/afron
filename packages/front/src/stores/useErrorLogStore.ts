import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export interface LogEntry {
    id: string;
    message: string;
    detail: string[];
    date: Date;
    occurredAt: {
        type: 'global';
    } | {
        type: 'session';
        sessionId: string;
    } | {
        type: 'unknown';
    };
}

export type LogData = {
    message: string;
    detail: string[];
    occurredAt: {
        type: 'global';
    } | {
        type: 'session';
        sessionId: string;
    } | {
        type: 'unknown';
    };
}

const MAX_LOG_ENTRIES = 256;

interface ErrorLogState {
    nextErrorId: number;

    hasUnread: boolean;
    markAsRead: () => void;
    markAsUnread: () => void;

    last: LogEntry | undefined;
    log: LogEntry[];
    add: (entry:  LogData) => string;
}

const useErrorLogStore = create<ErrorLogState>()(
    subscribeWithSelector((set, get) => ({
        nextErrorId: 1,
        hasUnread: false,
        last: undefined,
        log: [],

        add: (entry: LogData) => {
            const { nextErrorId } = get();
            const errorId = `error-${nextErrorId}`
            const last:LogEntry = {
                ...entry,
                id: errorId,
                date: new Date(),
            };

            set(state => ({
                log: [
                    last,
                    ...state.log.slice(-MAX_LOG_ENTRIES + 1),
                ],
                hasUnread: true,
                last: last,
                nextErrorId: nextErrorId + 1,
            }));
            return errorId;
        },
        markAsRead: () => set(() => ({ hasUnread: false })),
        markAsUnread: () => set(() => ({ hasUnread: true })),
    }))
);

export default useErrorLogStore;