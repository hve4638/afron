import runtime from '@/runtime';
import ThrottleAction from '@/features/throttle-action';
import { IPCInvokers, RTFlowData, ProfileStorage } from '@afron/types';

export function profileRTFlow(): IPCInvokers.ProfileRTFlow {
    const throttle = ThrottleAction.getInstance();

    return {
        async getFlowData(profileId: string, rtId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);

            const data = await rt.workflow.getWorkflowNodes();
            return [null, data];
        },
        async setFlowData(profileId: string, rtId: string, data: RTFlowData) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);
            await rt.workflow.setWorkflowNodes(data);

            return [null];
        },

        async getPrompts(profileId: string, rtId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);
            const promptsMetadata = await rt.workflow.getPrompts();

            return [null, promptsMetadata];
        },
        async setPrompts(profileId: string, rtId: string, order: ProfileStorage.RT.PromptOrder) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);
            await rt.workflow.setPromptsOrder(order);

            return [null];
        },
        async addPrompt(profileId: string, rtId: string, promptId: string, promptName: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);
            await rt.workflow.addPrompt(promptId, promptName);
            
            const prompts = await rt.workflow.getPrompts();
            return [null, prompts];
        },
        async removePrompt(profileId: string, rtId: string, promptId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);
            await rt.workflow.removePrompt(promptId);

            const prompts = await rt.workflow.getPrompts();
            return [null, prompts];
        }
    }
}