import LocalAPI from '@/api/local';

import EventPipe from './EventPipe';

class GlobalEventPipeSingleton extends EventPipe<GlobalEventData> {
    static instance?: GlobalEventPipeSingleton;

    static getInstance() {
        this.instance ??= new GlobalEventPipeSingleton();
        return this.instance;
    }
    private constructor() { super(); }

    override async connectEvent(callback) {
        return LocalAPI.events.onGlobal(callback);
    }
    override isClosedData(data: GlobalEventData) {
        return data === null || data.type === 'close';
    }

    async exportFile(profileId: string, rtId: string): Promise<string> {
        const chId = this.open();
        await LocalAPI.profileRTs.exportFile(chId, profileId, rtId);
        return chId;
    }

    async importRTFile(profileId: string): Promise<string> {
        const chId = this.open();

        await LocalAPI.profileRTs.importFile(chId, profileId);

        return chId;
    }
}

export default GlobalEventPipeSingleton;