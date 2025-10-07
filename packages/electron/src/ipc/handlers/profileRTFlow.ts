import runtime from '@/runtime';
import ThrottleAction from '@/features/throttle-action';

export function profileRTFlow(): IPCInvokers.ProfileRTFlow {
    const throttle = ThrottleAction.getInstance();

    return {
        async getFlowData(profileId: string, rtId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);

            const data = await rt.getFlowData();
            return [null, data];
        },
        async setFlowData(profileId: string, rtId: string, data: RTFlowData) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);
            await rt.setFlowData(data);

            return [null];
        }
    }
}