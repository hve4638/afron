export type Toast = {
    title: string;
    description: string|null;
    type: ToastMessageType;
    clickAction: ToastClickAction;
}

export type ToastClickAction = {
    action: 'open_error_log';
    error_id: string | null;
} | {
    action: 'none';
}

type ToastMessageType = 'error' | 'info' | 'success' | 'warn';
