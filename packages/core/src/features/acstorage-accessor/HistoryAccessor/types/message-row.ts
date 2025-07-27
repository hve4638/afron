export type HistoryMessageInsertRow = {
    type: 'text' | 'image_url' | 'image_base64' | 'file_url' | 'file_base64';
    origin: 'in' | 'out';
    text: string | null;
    data: string | null;
    data_name: string | null;
    data_type: string | null;
    token_count: number | null;
};

export type HistoryMessageRow = {
    id: number;
    history_id: number;
    message_index: number;
    message_type: 'text' | 'image_url' | 'image_base64' | 'file_url' | 'file_base64';

    origin: 'in' | 'out';

    text: string | null;
    data: string | null;
    data_name: string | null;
    data_type: string | null;
    data_thumbnail: string | null;
    
    token_count: number;
}