import { FastifyInstance } from 'fastify';
import runtime from '@/runtime';
import { route } from '@/utils/route';

export default async function(app: FastifyInstance) {
    app.post('/api/request', route(async (_params, { token, profileId, sessionId }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        runtime.logger.info(`RT request (token=${token}, sessionId=${sessionId})`);
        await runtime.rtWorker.request(token, { profile, sessionId }, { preview: false });
    }));

    app.post('/api/request/preview', route(async (_params, { token, profileId, sessionId }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        runtime.logger.info(`RT preview (token=${token}, sessionId=${sessionId})`);
        await runtime.rtWorker.request(token, { profile, sessionId }, { preview: true });
    }));

    app.post('/api/request/abort', route(async (_params, { token }) => {
        runtime.rtWorker.abort(token);
    }));
}
