import LocalAPI from 'api/local';
import Channel from '@hve/channel';
import { v7 as uuidv7 } from 'uuid';
import { RTEventData } from '@afron/types';

/**
 * RT 요청 수행 API
 * 
 * Electron-Front 간 IPC 통신 중계
 * 
 * 더 높은 계층에서의 처리는 RequestManager에서 수행
 */
class RequestAPI {
    static instance: RequestAPI | null = null;
    #bindId: number|null = null;
    #channels = new Map<string, Channel<RTEventData>>();

    static getInstance() {
        RequestAPI.instance ??= new RequestAPI();
        return RequestAPI.instance;
    }
    private constructor() {}

    async register() {
        if (this.#bindId) return;
        const binded = this.#onRequest.bind(this)

        this.#bindId = await LocalAPI.events.onRequest(binded);
    }
    async unregister() {
        if (this.#bindId == null) return;

        await LocalAPI.events.off(this.#bindId);
        this.#bindId = null;
    }

    #openCh(chId:string) {
        if (!this.#channels.get(chId)) {
            this.#channels.set(chId, new Channel<RTEventData>());
        }
    }
    
    #getCh(chId:string) {
        const ch = this.#channels.get(chId);
        if (!ch) {
            console.trace(`Response channel not found : '${chId}'`);
            throw new Error(`Response channel is closed : '${chId}'`);
        }

        return ch;
    }

    #closeCh(chId:string) {
        this.#channels.delete(chId);
    }

    async request(profileId:string, sessionId:string):Promise<string> {
        const chId = uuidv7();
        this.#openCh(chId);

        await LocalAPI.request.requestRT(chId, profileId, sessionId);

        return chId;
    }

    async preview(profileId:string, sessionId:string):Promise<string> {
        const chId = uuidv7();
        this.#openCh(chId);

        await LocalAPI.request.previewPrompt(chId, profileId, sessionId);

        return chId;
    }

    async response(chId:string) {
        let ch = this.#getCh(chId);
        const result = await ch.consume();

        /// @TODO: result null인 경우 처리 필요
        // 채널이 닫힌 경우에 발생하는데, 현재 로직상 null 발생은 없으나 적절한 처리 필요
        if (!result || result.type === 'close') {
            this.#closeCh(chId);
        }
        return result;
    }
    
    #onRequest(event:any, chId:string, data: RTEventData) {
        const ch = this.#getCh(chId);

        ch.produce(data);
    }
}

export default RequestAPI;