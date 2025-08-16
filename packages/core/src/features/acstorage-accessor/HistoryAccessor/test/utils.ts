import { HistoryRequired, HistoryMessageInsertRow, HistoryRow, HistoryAddRequired, HistoryUpdateRequired, HistoryId, HistoryMessageRequired } from '../types';

export class HistoryTest {
    static getAddRequired(rtId: string = 'test_id'): HistoryAddRequired {
        return {
            rt_id: rtId,
            rt_uuid: 'test-uuid',
            model_id: 'test-model',
            form: { prompt: 'Hello' },
            create_at: Date.now(),
        };
    }
    static getRowFromAddRequired(id: HistoryId, required: HistoryAddRequired): HistoryRow {
        /// @TODO: raw_response가 없으며 실제 구현에서 리턴하지도 않음
        // 수정 후 테스트 코드도 변경 필요
        return {
            id: id,
            rt_id: required.rt_id,
            rt_uuid: required.rt_uuid,
            model_id: required.model_id,
            form: JSON.stringify(required.form),
            create_at: required.create_at,
            input_token_count: 0,
            output_token_count: 0,
            is_complete: 0,
            branch_id: 0,
            chat_type: null as any,
            fetch_count: 0,
        } as Partial<HistoryRow> as HistoryRow;
    }
}

export class HistoryRowTest {
    static getTextMessage() {
        
    }
}


export {};