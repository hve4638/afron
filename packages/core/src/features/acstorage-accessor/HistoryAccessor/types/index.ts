export type { HistoryInsertRow, HistoryRow, HistoryUpdateRow } from './history-row';
export type { HistoryMessageInsertRow, HistoryMessageRow } from './message-row';

export type MessageRow = {
    id: number;
    history_id: number;
    message_index: number;
    message_type: 'text' | 'image_url' | 'image_base64' | 'file_url' | 'file_base64';
    origin: 'in' | 'out';
    text: string | null;
    data: string | null;
    data_name: string | null;
    data_type: string | null;
    token_count: number;
}

export type HistoryRequired = {
    chat_type?: 'chat' | 'normal';
    fetch_count: number;
    input: {
        type: 'text' | 'image_url' | 'file';
        text: string | null;
        data: string | null;
        token_count: number;
    }[];
    output: {
        type: 'text';
        text: string | null;
        data: null;
        token_count: number;
    }[];
    form: Record<string, unknown>;

    input_token_count: number;
    output_token_count: number;
    create_at: number;

    session_id: string;
    rt_id: string;
    rt_uuid: string;
    model_id: string;
};
