import runtime from '@/runtime';
import ThrottleAction from '@/features/throttle-action';
import { IPCInvokers, ProfileStorage } from '@afron/types';

function handler(): IPCInvokers.ProfileRT {
    const throttle = ThrottleAction.getInstance();

    return {
        async getMetadata(profileId: string, rtId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);
            const metadata = await rt.getMetadata();

            return [null, metadata];
        },
        async setMetadata(profileId: string, rtId: string, metadata: ProfileStorage.RT.Index) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);

            await rt.setMetadata(metadata);
            throttle.saveProfile(profile);

            return [null];
        },
        async reflectMetadata(profileId: string, rtId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            profile.updateRTMetadata(rtId);

            return [null];
        },

        async getForms(profileId: string, rtId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);

            const forms = await rt.getForms();
            return [null, forms];
        },
    }
}

export default handler;