import { FastifyInstance } from 'fastify';
import runtime from '@/runtime';
import ThrottleAction from '@/features/throttle-action';
import { route } from '@/utils/route';

export default async function(app: FastifyInstance) {
    const throttle = ThrottleAction.getInstance();

    app.get('/api/profiles', route(async () => {
        return runtime.profiles.getProfileIDs();
    }));

    app.post('/api/profiles', route(async () => {
        const identifier = await runtime.profiles.createProfile();
        throttle.saveProfiles();
        return identifier;
    }));

    app.delete('/api/profiles/:profileId', route(async (params) => {
        await runtime.profiles.deleteProfile(params['profileId']);
    }));

    app.get('/api/profiles/last', route(async () => {
        const [err, profile] = await runtime.globalStorage.accessAsJSON('cache.json').then(ac => {
            return [null, ac.getOne('last_profile')] as const;
        }).catch(e => [e] as const);
        if (err) return null;
        return profile;
    }));

    app.put('/api/profiles/last', route(async (_params, body) => {
        const ac = await runtime.globalStorage.accessAsJSON('cache.json');
        ac.set({ last_profile: body.id });
    }));

    app.get('/api/profiles/orphans', route(async () => {
        return runtime.profiles.getOrphanProfileIds();
    }));

    app.post('/api/profiles/orphans/:profileId/recover', route(async (params) => {
        await runtime.profiles.recoverOrphanProfile(params['profileId']);
    }));
}
