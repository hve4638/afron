import { FastifyInstance } from 'fastify';
import runtime from '@/runtime';
import ThrottleAction from '@/features/throttle-action';
import { route } from '@/utils/route';

export default async function(app: FastifyInstance) {
    const throttle = ThrottleAction.getInstance();

    app.get('/api/profiles/:profileId/sessions', route(async (params) => {
        const profile = await runtime.profiles.getProfile(params['profileId']);
        return profile.sessions.getIds();
    }));

    app.post('/api/profiles/:profileId/sessions', route(async (params) => {
        const profile = await runtime.profiles.getProfile(params['profileId']);
        const sid = await profile.sessions.create();
        throttle.saveProfile(profile);
        return sid;
    }));

    app.delete('/api/profiles/:profileId/sessions/:sessionId', route(async (params) => {
        const profile = await runtime.profiles.getProfile(params['profileId']);
        await profile.sessions.remove(params['sessionId']);
        throttle.saveProfile(profile);
    }));

    app.post('/api/profiles/:profileId/sessions/undo', route(async (params) => {
        const profile = await runtime.profiles.getProfile(params['profileId']);
        const sid = await profile.sessions.undoRemove();
        throttle.saveProfile(profile);
        if (sid == null) {
            throw new Error('No session to undo');
        }
        return sid;
    }));

    app.put('/api/profiles/:profileId/sessions/order', route(async (params, body) => {
        const profile = await runtime.profiles.getProfile(params['profileId']);
        profile.sessions.reorder(body.sessions);
        throttle.saveProfile(profile);
    }));
}
