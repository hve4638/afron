import { FastifyInstance } from 'fastify';
import runtime from '@/runtime';
import { route } from '@/utils/route';

export default async function(app: FastifyInstance) {
    app.get('/api/profiles/:profileId/models', route(async (params) => {
        const profile = await runtime.profiles.getProfile(params['profileId']);
        return profile.model.getCustomModels();
    }));

    app.put('/api/profiles/:profileId/models/:customId', route(async (params, body) => {
        const profile = await runtime.profiles.getProfile(params['profileId']);
        return profile.model.setCustomModel(body.model);
    }));

    app.delete('/api/profiles/:profileId/models/:customId', route(async (params) => {
        const profile = await runtime.profiles.getProfile(params['profileId']);
        await profile.model.removeCustomModel(params['customId']);
    }));

    app.get('/api/profiles/:profileId/models/:modelId/config', route(async (params) => {
        const profile = await runtime.profiles.getProfile(params['profileId']);
        return profile.model.getGlobalModelConfig(params['modelId']);
    }));

    app.put('/api/profiles/:profileId/models/:modelId/config', route(async (params, body) => {
        const profile = await runtime.profiles.getProfile(params['profileId']);
        await profile.model.setGlobalModelConfig(params['modelId'], body.config);
    }));
}
