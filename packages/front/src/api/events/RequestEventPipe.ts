import LocalAPI from '@/api/local';

import EventPipe from './EventPipe';
import { RTEventData } from '@afron/types';

/**
 * RT 요청 수행 API
 * 
 * Electron-Front 간 IPC 통신 중계
 * 
 * 더 높은 계층에서의 처리는 RequestManager에서 수행
 */
class RequestEventPipeSingleton extends EventPipe<RTEventData> {
    static instance?: RequestEventPipeSingleton;

    static getInstance() {
        this.instance ??= new RequestEventPipeSingleton();
        return this.instance;
    }
    private constructor() { super(); }
    
    override async connectEvent(callback) {
        return LocalAPI.events.onRequest(callback);
    }
    override isClosedData(data: RTEventData) {
        return data === null || data.type === 'close';
    }

    async request(profileId:string, sessionId:string):Promise<string> {
        const chId = this.open();

        await LocalAPI.request.requestRT(chId, profileId, sessionId);

        return chId;
    }

    async preview(profileId:string, sessionId:string):Promise<string> {
        const chId = this.open();

        await LocalAPI.request.previewPrompt(chId, profileId, sessionId);

        return chId;
    }
}

export default RequestEventPipeSingleton;