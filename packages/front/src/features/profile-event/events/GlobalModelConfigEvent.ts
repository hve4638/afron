import useProfileAPIStore from '@/stores/useProfileAPIStore';
import { GlobalModelConfiguration } from '@afron/types';

class GlobalModelConfigEvent {
    static async getGlobalConfig(modelId: string):Promise<GlobalModelConfiguration> {
        const { api } = useProfileAPIStore.getState();
        const modelIdFiltered = modelId.replaceAll('.', '_');

        const data = await api.get('model_config.json', [modelIdFiltered]);
        console.log('G>', modelIdFiltered, ':get:', data);
        return data[modelIdFiltered] ?? {};
    }

    static async setGlobalConfig(modelId: string, data: Partial<GlobalModelConfiguration>) {
        const { api } = useProfileAPIStore.getState();
        const modelIdFiltered = modelId.replaceAll('.', '_');

        console.log('S>', modelIdFiltered, ':set:', data);
        await api.set('model_config.json', { [modelIdFiltered]: data });
    }
}

export default GlobalModelConfigEvent;