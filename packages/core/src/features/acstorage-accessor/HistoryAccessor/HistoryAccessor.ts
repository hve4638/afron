import { ICustomAccessor } from 'ac-storage';
import HistoryDAO from './HistoryDAO';
import { type HistorySearchRow } from './HistoryDAO';
import { HistoryAddRequired, HistoryId, HistoryMessageAddRequired, HistoryMessageInsertRow, HistoryMessageRow, HistoryRequired, HistoryRow, HistoryUpdateRequired } from './types';

class HistoryAccessor implements ICustomAccessor {
    #dao: HistoryDAO;
    #droped: boolean = false;

    constructor(target: string | null) {
        this.#dao = new HistoryDAO(target);
    }

    /**
     * 새로운 history를 추가하고 complete를 0으로 설정
     * 
     * @returns historyId
     */
    addHistory(historyRequired: HistoryAddRequired): HistoryId {
        const {
            rt_id, rt_uuid, model_id,
            create_at,
            form,
        } = historyRequired;

        const historyId = this.#dao.insertHistory({
            rt_id, rt_uuid, model_id,
            create_at,
            form: JSON.stringify(form),
        });

        return historyId;
    }

    updateHistory(historyId: HistoryId, required: HistoryUpdateRequired): void {
        const {
            input_token_count, output_token_count,
            rt_id, rt_uuid,
            model_id,
            fetch_count,
            create_at,
            form,
        } = required;

        this.#dao.updateHistory(historyId, {
            input_token_count,
            output_token_count,
            rt_id,
            rt_uuid,
            model_id,
            fetch_count,
            create_at,
            form: JSON.stringify(form),
        });
    }

    addHistoryMessage(historyId: number, messages: HistoryMessageAddRequired[]) {
        for (const m of messages) {
            if (!m.text) continue;

            this.#dao.insertMessage(historyId, {
                ...m,
                type: 'text',
                origin: m.origin,
                text: m.text ?? null,
                data: m.data ?? null,
                data_name: m.data_name ?? null,
                data_type: m.data_type ?? null,
            });
        }
    }

    completeHistory(historyId: number): void {
        this.#dao.completeHistory(historyId);
    }

    getHistory(offset = 0, limit = 1000, desc = true): HistoryRow[] {
        const history = this.#dao.selectHistory({ offset, limit, desc });

        return history;
    }

    searchHistory(search: HistorySearchRow): HistoryRow[] {
        return this.#dao.searchHistory(search);
    }

    /// @TODO: 이미지 등 파일 대응 필요
    getMessageText(historyId: HistoryId): { input?: string, output?: string } {
        const messages = this.#dao.selectMessages(historyId);

        const inputText: string[] = [];
        const outputText: string[] = [];

        for (const message of messages) {
            if (message.origin === 'in') {
                if (message.text) inputText.push(message.text);
            }
            else if (message.origin === 'out') {
                if (message.text) outputText.push(message.text);
            }
        }

        return {
            input: inputText.length === 0 ? undefined : inputText.join(' '),
            output: outputText.length === 0 ? undefined : outputText.join(' '),
        };
    }

    /**
     * historyId의 메시지 중 특정 origin의 메시지를 모두 삭제
     * 
     * 모든 메시지가 삭제되면 history도 삭제됨
     * @param historyId 
     * @param origin 
     */
    deleteMessage(historyId: HistoryId, origin: 'in' | 'out' | 'both' = 'both'): void {
        let input = false;
        let output = false;
        this.#dao.selectMessageOrigin(historyId)
            .forEach(({ origin }) => {
                if (origin === 'in') input = true;
                else if (origin === 'out') output = true;
            });

        this.#dao.deleteMessages(historyId, origin);
        if (origin === 'in') {
            input = false;
        }
        else if (origin === 'out') {
            output = false;
        }
        else if (origin === 'both') {
            input = false;
            output = false;
        }

        if (!input && !output) {
            this.#dao.delete(historyId);
        }
    }

    delete(id: HistoryId) {
        this.#dao.delete(id);
    }

    deleteAll() {
        this.#dao.deleteAll();
    }

    drop() {
        if (this.#droped) return;
        this.#droped = true;

        this.#dao.drop();
    }

    isDropped() {
        return this.#droped;
    }

    commit() {

    }
}

export default HistoryAccessor;