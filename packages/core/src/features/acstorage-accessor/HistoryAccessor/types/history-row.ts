export type HistoryRow = {
    id: number;
    chat_type: 'chat' | 'normal';

    branch_id: number;

    input_token_count: number;
    output_token_count: number;

    form: string;

    raw_response: string;
    rt_id: string;
    rt_uuid: string;
    model_id: string;

    fetch_count: number;
    create_at: number;

    is_complete: number;
}

export interface HistoryInsertRow {
    form: string;
    rt_id: string;
    rt_uuid: string;
    model_id: string;
    create_at: number;
}

export type HistoryUpdateRow = Partial<{
    chat_type: 'chat' | 'normal';

    input_token_count: number | null;
    output_token_count: number | null;

    form: string;

    rt_id: string;
    rt_uuid: string;
    model_id: string;
    create_at: number;
    fetch_count: number;
}>

