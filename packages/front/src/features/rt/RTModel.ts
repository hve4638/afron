import { RTMetadata } from '@afron/types';

import { ProfileAPI } from '@/api/profiles';
import { useProfileAPIStore } from '@/stores';

export class RTModel {
    #api: ProfileAPI;
    
    constructor() {
        const { api } = useProfileAPIStore.getState();
        this.#api = api;
    }

    async createRT(metadata: RTMetadata, templateId: string = 'empty') {
        return await this.#api.rts.createRTUsingTemplate(metadata, templateId);
    }

    /**
     * RT 제거 및 트리에서 제거
     * 
     * @param rtId 
     * @returns 
     */
    async removeRT(rtId: string) {
        return await this.#api.rts.remove(rtId);
    }

    async renameRT(rtId: string, name: string) {
        await this.#api.rt(rtId).setMetadata({ name: name });
        await this.#api.rt(rtId).reflectMetadata();
    }
}