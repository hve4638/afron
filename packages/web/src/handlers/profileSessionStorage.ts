import { FastifyInstance } from 'fastify';
import runtime from '@/runtime';
import ThrottleAction from '@/features/throttle-action';
import { route } from '@/utils/route';

export default async function(app: FastifyInstance) {
    const throttle = ThrottleAction.getInstance();

    app.get('/api/profiles/:profileId/sessions/:sessionId/storage/:accessorId', route(async (params, _body, query) => {
        const profile = await runtime.profiles.getProfile(params['profileId']);
        const ac = await profile.accessAsJSON(`session:${params['sessionId']}:${params['accessorId']}`);
        const keys = query['keys'] ? query['keys'].split(',') : [];
        return ac.get(...keys);
    }));

    app.put('/api/profiles/:profileId/sessions/:sessionId/storage/:accessorId', route(async (params, body) => {
        const profile = await runtime.profiles.getProfile(params['profileId']);
        const ac = await profile.accessAsJSON(`session:${params['sessionId']}:${params['accessorId']}`);
        ac.set(body.data);
        throttle.saveProfile(profile);
    }));

    app.get('/api/profiles/:profileId/sessions/:sessionId/files', route(async (params) => {
        const profile = await runtime.profiles.getProfile(params['profileId']);
        return profile.session(params['sessionId']).getInputFilePreviews();
    }));

    app.post('/api/profiles/:profileId/sessions/:sessionId/files', route(async (params, body) => {
        const profile = await runtime.profiles.getProfile(params['profileId']);
        return profile.session(params['sessionId']).addInputFile(body.filename, body.dataURI);
    }));

    app.put('/api/profiles/:profileId/sessions/:sessionId/files', route(async (params, body) => {
        const profile = await runtime.profiles.getProfile(params['profileId']);
        return profile.session(params['sessionId']).updateInputFiles(body.fileHashes);
    }));
}
