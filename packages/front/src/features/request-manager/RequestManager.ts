import ProfilesAPI from '@/api/profiles';
import { RequestEventPipe } from '@/api/events';

import { responseReceiver } from './responseReceiver';

class RequestManager {
    static instance?: RequestManager;

    static getInstance() {
        RequestManager.instance ??= new RequestManager();
        return RequestManager.instance;
    }

    private constructor() {}

    async request(profileId: string, sessionId: string) {
        const sessionAPI = ProfilesAPI.profile(profileId).session(sessionId);

        RequestEventPipe.request(profileId, sessionId)
            .then((chId) => responseReceiver(chId, sessionAPI));
    }

    async preview(profileId: string, sessionId: string) {
        const sessionAPI = ProfilesAPI.profile(profileId).session(sessionId);

        RequestEventPipe.preview(profileId, sessionId)
            .then((chId) => responseReceiver(chId, sessionAPI));
    }
}

export default RequestManager;