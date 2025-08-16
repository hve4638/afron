import { IACSubStorage } from 'ac-storage';
import { ProfileError } from './errors';
import { v7 as uuidv7 } from 'uuid';

class ProfileModel {
    #storage: IACSubStorage;

    /**
     * @param storage 
     */
    constructor(storage: IACSubStorage) {
        this.#storage = storage;
    }

    async #accessAsData() {
        return await this.#storage.accessAsJSON('cache.json');
    }
    async #accessAsModelConfig() {
        return await this.#storage.accessAsJSON('model_config.json');
    }

    async getCustomModels(): Promise<CustomModel[]> {
        const dataAC = await this.#accessAsData();
        const customModels: CustomModel[] = dataAC.getOne('custom_models') ?? [];
        return customModels;
    }

    /**
     * 커스텀 모델 추가/업데이트
     * 
     * id가 지정되지 않으면 새로 생성, id가 지정되어 있으면 기존 모델 업데이트
     * 
     * @return 모델의 customeId 리턴
     */
    async setCustomModel(model: CustomModel): Promise<string> {
        const dataAC = await this.#accessAsData();
        const customModels: CustomModel[] = dataAC.getOne('custom_models') ?? [];

        if (!model.id) {
            model.id = uuidv7().trim();
            customModels.push(model);
        }
        else {
            const index = customModels.findIndex(m => m.id === model.id);
            if (index !== -1) {
                customModels[index] = model;
            }
            else {
                throw new ProfileError(`Custom model with id ${model.id} not found.`);
            }
        }

        dataAC.setOne('custom_models', customModels);
        return model.id;
    }

    async removeCustomModel(customId: string): Promise<void> {
        const dataAC = await this.#accessAsData();
        const customModels: CustomModel[] = dataAC.getOne('custom_models') ?? [];

        const index = customModels.findIndex(m => m.id === customId);
        customModels.splice(index, 1);

        dataAC.setOne('custom_models', customModels);
    }

    /** 모델 전역 설정 지정 */
    async getGlobalModelConfig(modelId: string) {
        const modelConfigAC = await this.#accessAsModelConfig();
        const modelIdFiltered = modelId.replaceAll('.', '_');

        return modelConfigAC.getOne(modelIdFiltered);
    }
    /** 모델 전역 설정 저장 */
    async setGlobalModelConfig(modelId: string, config: GlobalModelConfiguration) {
        const modelConfigAC = await this.#accessAsModelConfig();
        const modelIdFiltered = modelId.replaceAll('.', '_');

        return modelConfigAC.setOne(modelIdFiltered, config);
    }
}

export default ProfileModel;