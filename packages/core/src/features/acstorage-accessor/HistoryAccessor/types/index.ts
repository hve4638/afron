/**
 * 
 */

export type { HistoryInsertRow, HistoryRow, HistoryUpdateRow } from './history-row';
export type { HistoryMessageInsertRow, HistoryMessageRow } from './message-row';
export type { HistoryRequired, HistoryAddRequired, HistoryUpdateRequired } from './history-required';
export type { HistoryMessageRequired, HistoryMessageAddRequired} from './message-required';
export type { HistoryId } from './alias';

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
