export type Toast = {
    title: string;
    description: string | null;
    type: ToastMessageType;
    clickAction: ToastClickAction;
}

export type ToastClickAction = {
    action: 'none';
} | {
    action: 'open_error_log';
    error_id: string | null;
} | {
    action: 'open_info';
    item: Array<{
        name?: string;
        value: string;
    }>;
}

type ToastMessageType = 'fatal' | 'error' | 'info' | 'success' | 'warn';
