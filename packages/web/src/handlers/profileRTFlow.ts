import { FastifyInstance } from 'fastify';
import runtime from '@/runtime';
import ThrottleAction from '@/features/throttle-action';
import { route } from '@/utils/route';

export default async function(app: FastifyInstance) {
    const throttle = ThrottleAction.getInstance();

    app.get('/api/profiles/:profileId/rts/:rtId/flow', route(async ({ profileId, rtId }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        return await profile.rt(rtId).workflow.getWorkflowNodes();
    }));

    app.put('/api/profiles/:profileId/rts/:rtId/flow', route(async ({ profileId, rtId }, { data }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        await profile.rt(rtId).workflow.setWorkflowNodes(data);
    }));

    app.get('/api/profiles/:profileId/rts/:rtId/flow/prompts', route(async ({ profileId, rtId }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        return await profile.rt(rtId).workflow.getPrompts();
    }));

    app.put('/api/profiles/:profileId/rts/:rtId/flow/prompts', route(async ({ profileId, rtId }, { order }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        await profile.rt(rtId).workflow.setPromptsOrder(order);
    }));

    app.post('/api/profiles/:profileId/rts/:rtId/flow/prompts', route(async ({ profileId, rtId }, { promptId, promptName }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        const rt = profile.rt(rtId);
        await rt.workflow.addPrompt(promptId, promptName);
        return await rt.workflow.getPrompts();
    }));

    app.delete('/api/profiles/:profileId/rts/:rtId/flow/prompts/:promptId', route(async ({ profileId, rtId, promptId }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        const rt = profile.rt(rtId);
        await rt.workflow.removePrompt(promptId);
        return await rt.workflow.getPrompts();
    }));
}
