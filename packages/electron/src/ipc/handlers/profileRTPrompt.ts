import runtime from '@/runtime';
import ThrottleAction from '@/features/throttle-action';
import { IPCInvokers, RTPromptDataEditable, RTVarCreate, RTVarUpdate } from '@afron/types';

function handler(): IPCInvokers.ProfileRTPrompt {
    const throttle = ThrottleAction.getInstance();

    return {
        async getMetadata(profileId: string, rtId: string, promptId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);
            const metadata = await rt.prompt.getMetadata(promptId);

            return [null, metadata];
        },
        async setMetadata(profileId: string, rtId: string, promptId: string, metadata: RTPromptDataEditable) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);
            await rt.prompt.setMetadata(promptId, metadata);
            await profile.updateRTMetadata(rtId);
            throttle.saveProfile(profile);

            return [null];
        },

        async getName(profileId: string, rtId: string, promptId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);
            const name = await rt.prompt.getName(promptId);

            return [null, name];
        },
        async setName(profileId: string, rtId: string, promptId: string, name: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);
            await rt.prompt.setName(promptId, name);
            await profile.updateRTMetadata(rtId);
            throttle.saveProfile(profile);

            return [null];
        },

        async getVariableNames(profileId: string, rtId: string, promptId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);
            const names = await rt.prompt.getVariableNames(promptId);

            return [null, names];
        },
        async getVariables(profileId: string, rtId: string, promptId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);
            const variables = await rt.prompt.getVariables(promptId);

            return [null, variables];
        },
        async setVariables(profileId: string, rtId: string, promptId: string, vars: (RTVarCreate | RTVarUpdate)[]) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);

            const varIds: string[] = await rt.prompt.setVariables(promptId, vars);
            throttle.saveProfile(profile);

            return [null, varIds] as const;
        },
        async removeVariables(profileId: string, rtId: string, promptId: string, varIds: string[]) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);

            await rt.prompt.removeVariables(promptId, varIds);
            throttle.saveProfile(profile);

            return [null];
        },

        async getContents(profileId: string, rtId: string, promptId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);
            const contents = await rt.prompt.getContents(promptId);

            return [null, contents];
        },
        async setContents(profileId: string, rtId: string, promptId: string, contents: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);
            await rt.prompt.setContents(promptId, contents);
            throttle.saveProfile(profile);

            return [null];
        },
    }
}

export default handler;