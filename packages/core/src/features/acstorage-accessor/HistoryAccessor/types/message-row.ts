export type HistoryMessageRow = {
    /** PRIMARY KEY */
    id: number;
    /** HistoryId Foreign Key */
    history_id: number;
    /** 메시지 순서 */
    message_index: number;
    /** 메시지 타입 */
    message_type: 'text' | 'image_url' | 'image_base64' | 'file_url' | 'file_base64';

    /** 메시지 출처 */
    origin: 'in' | 'out';

    text: string | null;
    data: string | null;
    data_name: string | null;
    data_type: string | null;
    data_thumbnail: string | null;

    token_count: number;
}

export type HistoryMessageInsertRow = {
    type: 'text' | 'image_url' | 'image_base64' | 'file_url' | 'file_base64';
    origin: 'in' | 'out';
    text?: string | null;
    data?: string | null;
    data_name?: string | null;
    data_type?: string | null;
    token_count?: number | null;
};
