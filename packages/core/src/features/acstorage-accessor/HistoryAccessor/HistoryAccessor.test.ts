import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import HistoryAccessor from './HistoryAccessor';
import { HistoryRequired, HistoryMessageInsertRow, HistoryRow, HistoryAddRequired, HistoryUpdateRequired, HistoryId } from './types';
import { HistoryTest } from './test/utils';

describe('HistoryAccessor', () => {
    let accessor: HistoryAccessor;

    beforeEach(() => {
        // Use in-memory database for each test to ensure isolation
        accessor = new HistoryAccessor(null);
    });

    afterEach(() => {
        // Drop the in-memory database after each test
        accessor.drop();
    });

    function getTextMessage(text: string, origin: 'in' | 'out', token_count: number = 5): HistoryMessageInsertRow {
        return {
            type: 'text',
            text: text,
            origin: origin,
            data: null,
            data_name: null,
            data_type: null,
            token_count: token_count,
        };
    }

    it('should insert and select history', () => {
        const required = HistoryTest.getAddRequired();
        const historyId = accessor.addHistory(required);
        const rows = accessor.getHistory(0, 1);

        expect(rows).toHaveLength(1);
        const row = rows[0];

        const expectedRow = HistoryTest.getRowFromAddRequired(historyId, required);
        expect(row).toEqual(expectedRow);
    });

    it('should update history', () => {
        const required = HistoryTest.getAddRequired();

        const historyId = accessor.addHistory(required);
        const updates: HistoryUpdateRequired = {
            input_token_count: 100,
            output_token_count: 200,
        };
        accessor.updateHistory(historyId, updates);

        const [row] = accessor.getHistory(0, 1);
        expect(row.input_token_count).toBe(100);
        expect(row.output_token_count).toBe(200);
    });

    it('should insert and select history messages', () => {
        const historyRequired = HistoryTest.getAddRequired();

        const historyId = accessor.addHistory(historyRequired);
        const inMessage = getTextMessage('Test message', 'in');
        const outMessage = getTextMessage('Hello world', 'out');

        accessor.addHistoryMessage(historyId, [inMessage]);
        accessor.addHistoryMessage(historyId, [outMessage]);

        const { input, output } = accessor.getMessageText(historyId);
        expect(input).toBe('Test message');
        expect(output).toBe('Hello world');
    });

    it('should mark a history as complete', () => {
        const historyRequired = HistoryTest.getAddRequired();

        const historyId = accessor.addHistory(historyRequired);
        accessor.completeHistory(historyId);

        const [row] = accessor.getHistory(0, 1);
        expect(row.is_complete).toBe(1);
    });

    it('should search history by message text', () => {
        const historyRequired1 = HistoryTest.getAddRequired('rt-1');
        const historyRequired2 = HistoryTest.getAddRequired('rt-2');

        const historyId1 = accessor.addHistory(historyRequired1);
        accessor.addHistoryMessage(historyId1, [getTextMessage('hello world', 'in')]);
        accessor.addHistoryMessage(historyId1, [getTextMessage('apple', 'out')]);

        const historyId2 = accessor.addHistory(historyRequired2);
        accessor.addHistoryMessage(historyId2, [getTextMessage('hello friend', 'in')]);
        accessor.addHistoryMessage(historyId2, [getTextMessage('banana', 'out')]);

        const rows1 = accessor.searchHistory({ text: 'hello', search_scope: 'any', regex: false, offset: 0, limit: 10 });
        expect(rows1).toHaveLength(2);

        const rows2 = accessor.searchHistory({ text: 'world', search_scope: 'input', regex: false, offset: 0, limit: 10 });
        expect(rows2).toHaveLength(1);
        expect(rows2[0].id).toBe(historyId1);

        const rows3 = accessor.searchHistory({ text: 'ban', search_scope: 'output', regex: false, offset: 0, limit: 10 });
        expect(rows3).toHaveLength(1);
        expect(rows3[0].id).toBe(historyId2);

        const rows4 = accessor.searchHistory({ text: 'hello', search_scope: 'output', regex: false, offset: 0, limit: 10 });
        expect(rows4).toHaveLength(0);
    });

    it('should delete a history entry', () => {
        const required = HistoryTest.getAddRequired();
        const historyId = accessor.addHistory(required);
        expect(accessor.getHistory(0, 10)).toHaveLength(1);

        accessor.delete(historyId);
        expect(accessor.getHistory(0, 10)).toHaveLength(0);
    });
});
