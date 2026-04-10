import { FastifyInstance } from 'fastify';
import runtime from '@/runtime';
import ThrottleAction from '@/features/throttle-action';
import { route } from '@/utils/route';

export default async function(app: FastifyInstance) {
    const throttle = ThrottleAction.getInstance();

    app.get('/api/profiles/:profileId/rts/:rtId/prompts/:promptId/metadata', route(async ({ profileId, rtId, promptId }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        return await profile.rt(rtId).prompt.getMetadata(promptId);
    }));

    app.put('/api/profiles/:profileId/rts/:rtId/prompts/:promptId/metadata', route(async ({ profileId, rtId, promptId }, { metadata }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        await profile.rt(rtId).prompt.setMetadata(promptId, metadata);
        await profile.updateRTMetadata(rtId);
        throttle.saveProfile(profile);
    }));

    app.get('/api/profiles/:profileId/rts/:rtId/prompts/:promptId/name', route(async ({ profileId, rtId, promptId }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        return await profile.rt(rtId).prompt.getName(promptId);
    }));

    app.put('/api/profiles/:profileId/rts/:rtId/prompts/:promptId/name', route(async ({ profileId, rtId, promptId }, { name }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        await profile.rt(rtId).prompt.setName(promptId, name);
        await profile.updateRTMetadata(rtId);
        throttle.saveProfile(profile);
    }));

    app.get('/api/profiles/:profileId/rts/:rtId/prompts/:promptId/variables', route(async ({ profileId, rtId, promptId }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        return await profile.rt(rtId).prompt.getVariables(promptId);
    }));

    app.get('/api/profiles/:profileId/rts/:rtId/prompts/:promptId/variables/names', route(async ({ profileId, rtId, promptId }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        return await profile.rt(rtId).prompt.getVariableNames(promptId);
    }));

    app.put('/api/profiles/:profileId/rts/:rtId/prompts/:promptId/variables', route(async ({ profileId, rtId, promptId }, { vars }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        const varIds: string[] = await profile.rt(rtId).prompt.setVariables(promptId, vars);
        throttle.saveProfile(profile);
        return varIds;
    }));

    app.delete('/api/profiles/:profileId/rts/:rtId/prompts/:promptId/variables', route(async ({ profileId, rtId, promptId }, { varIds }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        await profile.rt(rtId).prompt.removeVariables(promptId, varIds);
        throttle.saveProfile(profile);
    }));

    app.get('/api/profiles/:profileId/rts/:rtId/prompts/:promptId/contents', route(async ({ profileId, rtId, promptId }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        return await profile.rt(rtId).prompt.getContents(promptId);
    }));

    app.put('/api/profiles/:profileId/rts/:rtId/prompts/:promptId/contents', route(async ({ profileId, rtId, promptId }, { contents }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        await profile.rt(rtId).prompt.setContents(promptId, contents);
        throttle.saveProfile(profile);
    }));
}
