import ProfilesAPI from '@/api/profiles';
import LocalAPI from '@/api/local';
import { RequestEventPipe } from '@/api/events';

import { responseReceiver } from './responseReceiver';
import { useSessionStore } from '@/stores';

class RequestManager {
    static instance?: RequestManager;

    static getInstance() {
        RequestManager.instance ??= new RequestManager();
        return RequestManager.instance;
    }

    private constructor() { }

    async request(profileId: string, sessionId: string) {
        const sessionAPI = ProfilesAPI.profile(profileId).session(sessionId);

        const chId = await RequestEventPipe.request(profileId, sessionId);
        responseReceiver(chId, sessionAPI);

        return chId; // .then((chId) => );
    }

    async preview(profileId: string, sessionId: string) {
        const sessionAPI = ProfilesAPI.profile(profileId).session(sessionId);

        RequestEventPipe.preview(profileId, sessionId)
            .then((chId) => responseReceiver(chId, sessionAPI));
    }
    async abortAll() {
        const { running_rt, update: updateSessionStore } = useSessionStore.getState();

        const abortPromise = Object.values(running_rt)
            .map(
                async ({ token }) => {
                    await LocalAPI.request.abort(token);
                    return token;
                }
            );

        await Promise.all(abortPromise)
            .then(async (abortedTokens) => {
                const { running_rt } = useSessionStore.getState();
                const filtered = Object.entries(running_rt).filter(([, { token }]) => !abortedTokens.includes(token));

                await updateSessionStore.running_rt(Object.fromEntries(filtered));
                await updateSessionStore.state('idle');
                console.log('Aborted tokens:', filtered);
                console.log('change state:', 'idle');
            });
    }
}

export default RequestManager;