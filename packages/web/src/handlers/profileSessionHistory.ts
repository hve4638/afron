import { FastifyInstance } from 'fastify';
import runtime from '@/runtime';
import { HistoryMessage, HistoryMetadata, HistorySearch } from '@afron/types';
import { route } from '@/utils/route';

export default async function(app: FastifyInstance) {
    app.get('/api/profiles/:profileId/sessions/:sessionId/history', route(async (params, _body, query) => {
        const profile = await runtime.profiles.getProfile(params['profileId']);
        const accessor = await profile.accessAsHistory(params['sessionId']);
        const offset = Number(query['offset'] ?? 0);
        const limit = Number(query['limit'] ?? 50);
        const desc = query['desc'] === 'true';
        const historyRows = accessor.getHistory(offset, limit, desc);
        const metadata: HistoryMetadata[] = historyRows.map(row => ({
            id: row.id,
            requestType: row.chat_type,
            createdAt: row.create_at,
            bookmark: false,
            rtId: row.rt_id,
            rtUUID: row.rt_uuid,
            modelId: row.model_id,
            form: JSON.parse(row.form),
            isComplete: Boolean(row.is_complete),
        }));
        return metadata;
    }));

    app.post('/api/profiles/:profileId/sessions/:sessionId/history/search', route(async (params, body) => {
        const profile = await runtime.profiles.getProfile(params['profileId']);
        const accessor = await profile.accessAsHistory(params['sessionId']);
        const condition: HistorySearch = body.condition;
        const rows = accessor.searchHistory({
            text: condition.text,
            search_scope: condition.searchScope,
            regex: false,
            offset: body.offset,
            limit: body.limit,
        });
        const metadata: HistoryMetadata[] = rows.map(row => ({
            id: row.id,
            requestType: row.chat_type,
            createdAt: row.create_at,
            bookmark: false,
            rtId: row.rt_id,
            rtUUID: row.rt_uuid,
            modelId: row.model_id,
            form: JSON.parse(row.form),
            isComplete: Boolean(row.is_complete),
        }));
        return metadata;
    }));

    app.get('/api/profiles/:profileId/sessions/:sessionId/history/messages', route(async (params, _body, query) => {
        const profile = await runtime.profiles.getProfile(params['profileId']);
        const accessor = await profile.accessAsHistory(params['sessionId']);
        const historyIds = query['ids'] ? query['ids'].split(',').map(Number) : [];
        const messages: HistoryMessage[] = [];
        for (const id of historyIds) {
            const { input, output } = accessor.getMessageText(id);
            messages.push({ id, input, output });
        }
        return messages;
    }));

    app.delete('/api/profiles/:profileId/sessions/:sessionId/history/:historyId/message', route(async (params, _body, query) => {
        const profile = await runtime.profiles.getProfile(params['profileId']);
        const accessor = await profile.accessAsHistory(params['sessionId']);
        accessor.deleteMessage(Number(params['historyId']), query['origin'] as 'in' | 'out' | 'both');
    }));

    app.delete('/api/profiles/:profileId/sessions/:sessionId/history/:historyId', route(async (params) => {
        const profile = await runtime.profiles.getProfile(params['profileId']);
        const accessor = await profile.accessAsHistory(params['sessionId']);
        accessor.delete(Number(params['historyId']));
    }));

    app.delete('/api/profiles/:profileId/sessions/:sessionId/history', route(async (params) => {
        const profile = await runtime.profiles.getProfile(params['profileId']);
        const accessor = await profile.accessAsHistory(params['sessionId']);
        accessor.deleteAll();
    }));
}
