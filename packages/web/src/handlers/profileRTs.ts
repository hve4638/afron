import { FastifyInstance } from 'fastify';
import * as utils from '@/utils';
import runtime from '@/runtime';
import { type Profile } from '@afron/core';
import { route } from '@/utils/route';

export default async function(app: FastifyInstance) {
    const throttles = {};

    const saveProfile = (profile: Profile) => {
        const throttleId = `profile_${profile.path}`;
        throttles[throttleId] ??= utils.throttle(500);
        throttles[throttleId](() => {
            profile.commit();
        });
    }

    app.get('/api/profiles/:profileId/rts', route(async ({ profileId }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        return await profile.getRTTree();
    }));

    app.put('/api/profiles/:profileId/rts', route(async ({ profileId }, { tree }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        profile.updateRTTree(tree);
        saveProfile(profile);
    }));

    app.post('/api/profiles/:profileId/rts', route(async ({ profileId }, { metadata }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        await profile.addRT(metadata);
        saveProfile(profile);
    }));

    app.delete('/api/profiles/:profileId/rts/:rtId', route(async ({ profileId, rtId }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        profile.removeRT(rtId);
        saveProfile(profile);
    }));

    app.post('/api/profiles/:profileId/rts/generate-id', route(async ({ profileId }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        return await profile.generateRTId();
    }));

    app.get('/api/profiles/:profileId/rts/:rtId/exists', route(async ({ profileId, rtId }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        return await profile.hasRTId(rtId);
    }));

    app.put('/api/profiles/:profileId/rts/:rtId/id', route(async ({ profileId, rtId }, { newRTId }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        profile.changeRTId(rtId, newRTId);
        saveProfile(profile);
    }));

    app.post('/api/profiles/:profileId/rts/from-template', route(async ({ profileId }, { metadata, templateId }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        await profile.createUsingTemplate(metadata, templateId);
    }));
}
