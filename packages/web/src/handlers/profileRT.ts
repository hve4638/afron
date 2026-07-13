import { FastifyInstance } from 'fastify';
import runtime from '@/runtime';
import ThrottleAction from '@/features/throttle-action';
import { route } from '@/utils/route';

export default async function(app: FastifyInstance) {
    const throttle = ThrottleAction.getInstance();

    app.get('/api/profiles/:profileId/rts/:rtId/metadata', route(async ({ profileId, rtId }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        return await profile.rt(rtId).getMetadata();
    }));

    app.put('/api/profiles/:profileId/rts/:rtId/metadata', route(async ({ profileId, rtId }, { metadata }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        await profile.rt(rtId).setMetadata(metadata);
        throttle.saveProfile(profile);
    }));

    app.post('/api/profiles/:profileId/rts/:rtId/metadata/reflect', route(async ({ profileId, rtId }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        profile.updateRTMetadata(rtId);
    }));

    app.get('/api/profiles/:profileId/rts/:rtId/forms', route(async ({ profileId, rtId }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        return await profile.rt(rtId).getForms();
    }));
}
