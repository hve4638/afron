import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import HistoryDAO from './HistoryDAO';
import { HistoryInsertRow, HistoryMessageInsertRow, HistoryMessageRow, HistoryRow } from './types';

describe('HistoryDAO', () => {
    let dao: HistoryDAO;

    beforeEach(() => {
        dao = new HistoryDAO(null); // Use in-memory database
    });

    afterEach(() => {
        dao.close();
    });

    const HistoryInsertRowExample: HistoryInsertRow = {
        rt_id: 'test-rt',
        rt_uuid: 'test-uuid',
        model_id: 'test-model',
        form: JSON.stringify({ prompt: 'Hello' }),
        create_at: Date.now(),
    };
    /// @TODO: raw_response가 없으며 실제 구현에서 리턴하지도 않음
    // 수정 후 테스트 코드도 변경 필요
    const HistoryRowExample: HistoryRow = {
        id: 1,
        rt_id: HistoryInsertRowExample.rt_id,
        rt_uuid: HistoryInsertRowExample.rt_uuid,
        model_id: HistoryInsertRowExample.model_id,
        form: HistoryInsertRowExample.form,
        create_at: HistoryInsertRowExample.create_at,
        input_token_count: 0,
        output_token_count: 0,
        is_complete: 0,
        branch_id: 0,
        chat_type: null as any,
        fetch_count: 0,
    } as HistoryRow;

    function getMessage(origin: 'in' | 'out', text: string, token_count: number = 5): HistoryMessageInsertRow {
        return {
            type: 'text',
            origin: origin,
            text: text,
            data: null,
            data_name: null,
            data_type: null,
            token_count: token_count,
        };
    }

    it('insert / select history', () => {
        const historyId = dao.insertHistory(HistoryInsertRowExample);
        expect(historyId).toBe(1);

        const historyRows = dao.selectHistory({ offset: 0, limit: 1 });
        expect(historyRows).toHaveLength(1);
        expect(historyRows[0]).toEqual(HistoryRowExample);
    });

    it('insert / select history messages', () => {
        const messageData0 = getMessage('in', 'Test message', 2);
        const messageData1 = getMessage('out', 'Hello world', 3);

        const historyId = dao.insertHistory(HistoryInsertRowExample);
        dao.insertMessage(historyId, messageData0);
        dao.insertMessage(historyId, messageData1);

        const expectedMessage0: HistoryMessageRow = {
            id: 1,
            history_id: 1,
            message_index: 0,
            message_type: 'text',
            origin: 'in',
            text: 'Test message',
            data: null,
            data_name: null,
            data_type: null,
            data_thumbnail: null,
            token_count: 2,
        };
        const expectedMessage1: HistoryMessageRow = {
            id: 2,
            history_id: 1,
            message_index: 1,
            message_type: 'text',
            origin: 'out',
            text: 'Hello world',
            data: null,
            data_name: null,
            data_type: null,
            data_thumbnail: null,
            token_count: 3,
        };

        const actualMessages = dao.selectMessages(historyId);
        expect(actualMessages).toHaveLength(2);
        expect(actualMessages[0]).toEqual(expectedMessage0);
        expect(actualMessages[1]).toEqual(expectedMessage1);
    });

    it('update history', () => {
        const historyId = dao.insertHistory(HistoryInsertRowExample);
        const updates = {
            input_token_count: 100,
            output_token_count: 200,
        };
        dao.updateHistory(historyId, updates);

        const rows = dao.selectHistory({ offset: 0, limit: 1 });
        const row = rows[0];
        expect(row.input_token_count).toBe(100);
        expect(row.output_token_count).toBe(200);
    });

    it('mark a history as complete', () => {
        const historyId = dao.insertHistory(HistoryInsertRowExample);
        dao.completeHistory(historyId);

        const rows = dao.selectHistory({ offset: 0, limit: 1 });
        const row = rows[0];
        expect(row.is_complete).toBe(1);
    });

    it('search history by message text', () => {
        const historyId0 = dao.insertHistory(HistoryInsertRowExample);

        const messageData0_0 = getMessage('in', 'hello world');
        const messageData0_1 = getMessage('out', 'apple');
        dao.insertMessage(historyId0, messageData0_0);
        dao.insertMessage(historyId0, messageData0_1);

        const historyId1 = dao.insertHistory(HistoryInsertRowExample);
        const messageData1_0 = getMessage('in', 'hello friend');
        const messageData1_1 = getMessage('out', 'banana');
        dao.insertMessage(historyId1, messageData1_0);
        dao.insertMessage(historyId1, messageData1_1);

        {
            const rows = dao.searchHistory({ text: 'hello', search_scope: 'any', regex: false, offset: 0, limit: 10 });
            expect(rows).toHaveLength(2);
            expect(rows[0].id).toBe(historyId0);
            expect(rows[1].id).toBe(historyId1);
        }
        {
            const rows = dao.searchHistory({ text: 'hello', search_scope: 'output', regex: false, offset: 0, limit: 10 });
            expect(rows).toHaveLength(0);
        }
        {
            const rows = dao.searchHistory({ text: 'world', search_scope: 'input', regex: false, offset: 0, limit: 10 });
            expect(rows).toHaveLength(1);
            expect(rows[0].id).toBe(historyId0);
        }
        {
            const rows = dao.searchHistory({ text: 'apple', search_scope: 'output', regex: false, offset: 0, limit: 10 });
            expect(rows).toHaveLength(1);
            expect(rows[0].id).toBe(historyId0);
        }
        {
            const rows = dao.searchHistory({ text: 'ban', search_scope: 'output', regex: false, offset: 0, limit: 10 });
            expect(rows).toHaveLength(1);
            expect(rows[0].id).toBe(historyId1);
        }
    });

    it('delete history', () => {
        const historyId = dao.insertHistory(HistoryInsertRowExample);
        {
            const rows = dao.selectHistory({ offset: 0, limit: 10 });
            expect(rows).toHaveLength(1);
        }

        dao.delete(historyId);
        {
            const rows = dao.selectHistory({ offset: 0, limit: 10 });
            expect(rows).toHaveLength(0);
        }
    });
});
