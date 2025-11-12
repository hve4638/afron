import runtime from '@/runtime';
import { CustomModel, GlobalModelConfiguration, IPCInvokers } from '@afron/types';

function handler(): IPCInvokers.Profile {
    return {
        async getCustomModels(profileId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const models = await profile.model.getCustomModels();

            return [null, models];
        },
        async setCustomModel(profileId: string, model: CustomModel) {
            const profile = await runtime.profiles.getProfile(profileId);
            const customId = await profile.model.setCustomModel(model);

            return [null, customId];

        },
        async removeCustomModel(profileId: string, customId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            await profile.model.removeCustomModel(customId);

            return [null];
        },

        async getGlobalModelConfig(profileId: string, modelId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const config = await profile.model.getGlobalModelConfig(modelId);

            return [null, config];
        },
        async setGlobalModelConfig(profileId: string, modelId: string, config: GlobalModelConfiguration) {
            const profile = await runtime.profiles.getProfile(profileId);
            await profile.model.setGlobalModelConfig(modelId, config);
            
            return [null];
        }
    }
}

export default handler;