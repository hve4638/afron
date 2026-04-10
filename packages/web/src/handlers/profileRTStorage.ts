import { FastifyInstance } from 'fastify';
import runtime from '@/runtime';
import ThrottleAction from '@/features/throttle-action';
import { route } from '@/utils/route';

export default async function(app: FastifyInstance) {
    const throttle = ThrottleAction.getInstance();

    app.get('/api/profiles/:profileId/rts/:rtId/storage/:accessorId', route(async ({ profileId, rtId, accessorId }, _body, query) => {
        const profile = await runtime.profiles.getProfile(profileId);
        const accessor = await profile.accessAsJSON(accessorId);
        const keys = query['keys'] ? query['keys'].split(',') : [];
        return accessor.get(...keys);
    }));

    app.put('/api/profiles/:profileId/rts/:rtId/storage/:accessorId', route(async ({ profileId, rtId, accessorId }, { data }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        const accessor = await profile.accessAsJSON(accessorId);
        accessor.set(data);
        throttle.saveProfile(profile);
    }));
}
