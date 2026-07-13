import { FastifyInstance } from 'fastify';
import * as utils from '@/utils';
import runtime from '@/runtime';
import { type Profile } from '@afron/core';
import { route } from '@/utils/route';

export default async function(app: FastifyInstance) {
    const throttles: Record<string, ReturnType<typeof utils.throttle>> = {};

    const saveProfile = (profile: Profile) => {
        const throttleId = `profile_${profile.path}`;
        throttles[throttleId] ??= utils.throttle(500);
        throttles[throttleId](() => {
            profile.commit();
        });
    };

    app.get('/api/profiles/:profileId/storage/:accessorId', route(async (params, _body, query) => {
        const profileId = params['profileId'];
        const accessorId = params['accessorId'];
        const keys = (query['keys'] as string)?.split(',') ?? [];
        const profile = await runtime.profiles.getProfile(profileId);
        const accessor = await profile.accessAsJSON(accessorId);
        return accessor.get(...keys);
    }));

    app.put('/api/profiles/:profileId/storage/:accessorId', route(async (params, body) => {
        const profileId = params['profileId'];
        const accessorId = params['accessorId'];
        const profile = await runtime.profiles.getProfile(profileId);
        const accessor = await profile.accessAsJSON(accessorId);
        accessor.set(body.data);
        saveProfile(profile);
    }));

    app.get('/api/profiles/:profileId/storage/:accessorId/text', route(async (params) => {
        const profileId = params['profileId'];
        const accessorId = params['accessorId'];
        const profile = await runtime.profiles.getProfile(profileId);
        const accessor = await profile.accessAsText(accessorId);
        return accessor.read();
    }));

    app.put('/api/profiles/:profileId/storage/:accessorId/text', route(async (params, body) => {
        const profileId = params['profileId'];
        const accessorId = params['accessorId'];
        const profile = await runtime.profiles.getProfile(profileId);
        const accessor = await profile.accessAsText(accessorId);
        accessor.write(body.value);
    }));

    app.get('/api/profiles/:profileId/storage/:accessorId/binary', route(async (params) => {
        const profileId = params['profileId'];
        const accessorId = params['accessorId'];
        const profile = await runtime.profiles.getProfile(profileId);
        const accessor = await profile.accessAsBinary(accessorId);
        return accessor.read();
    }));

    app.put('/api/profiles/:profileId/storage/:accessorId/binary', route(async (params, body) => {
        const profileId = params['profileId'];
        const accessorId = params['accessorId'];
        const profile = await runtime.profiles.getProfile(profileId);
        const accessor = await profile.accessAsBinary(accessorId);
        accessor.write(body.content);
    }));

    app.post('/api/profiles/:profileId/storage/:accessorId/verify', route(async (params, body) => {
        const profileId = params['profileId'];
        const accessorId = params['accessorId'];
        const profile = await runtime.profiles.getProfile(profileId);
        const accessor = await profile.accessAsSecret(accessorId);
        const result = accessor.exists(body.keys);
        saveProfile(profile);
        return result;
    }));

    app.put('/api/profiles/:profileId/storage/:accessorId/secret', route(async (params, body) => {
        const profileId = params['profileId'];
        const accessorId = params['accessorId'];
        const profile = await runtime.profiles.getProfile(profileId);
        const accessor = await profile.accessAsSecret(accessorId);
        accessor.set(body.data);
        saveProfile(profile);
    }));

    app.delete('/api/profiles/:profileId/storage/:accessorId/secret', route(async (params, body) => {
        const profileId = params['profileId'];
        const accessorId = params['accessorId'];
        const profile = await runtime.profiles.getProfile(profileId);
        const accessor = await profile.accessAsSecret(accessorId);
        accessor.remove(body.keys);
        saveProfile(profile);
    }));
}
