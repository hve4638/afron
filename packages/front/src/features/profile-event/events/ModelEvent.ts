import { v7 } from 'uuid';

import useProfileAPIStore from '@/stores/useProfileAPIStore';
import useCacheStore from '@/stores/useCacheStore';
import useDataStore from '@/stores/useDataStore';
import { ProfileSessionMetadata } from '@/types';
import useMemoryStore from '@/stores/useMemoryStore';

class ModelEvent {
    static isModelStarred(key) {
        const { starred_models } = useDataStore.getState();
        return starred_models.includes(key);
    }
    static async starModel(modelKey: string) {
        const { starred_models, update: updateData } = useDataStore.getState();
        updateData.starred_models([...starred_models, modelKey]);
    }
    static async unstarModel(modelKey: string) {
        const { starred_models, update: updateData } = useDataStore.getState();
        const filtered = starred_models.filter(item => item !== modelKey);
        updateData.starred_models(filtered);
    }

    static async filterModels() {
        const caches = useCacheStore.getState();
        const { allModels } = useMemoryStore.getState();

        const isModelShow = (model: ChatAIModel) => {
            if (model.flags.featured) {
                return true;
            }
            // '주 모델만' 활성화 시 featured 모델만 표시
            else if (caches.setting_models_show_featured) {
                return false;
            }
            // '스냅샷', '실험적', '비권장'이 아니라면 표시 
            else if (
                !model.flags.snapshot
                && !model.flags.deprecated
            ) {
                return true;
            }
            // '비권장' 우선 확인
            // '비권장' 태그가 있으면 다른 태그가 있어도 표시하지 않음
            else if (
                !caches.setting_models_show_deprecated
                && model.flags.deprecated
            ) {
                return false;
            }
            // 옵션 체크
            else if (
                (model.flags.snapshot && caches.setting_models_show_snapshot) ||
                (model.flags.deprecated && caches.setting_models_show_deprecated)
            ) {
                return true;
            }
        }

        const newProviders: ChatAIModelCategory[] = [];
        for (const c of allModels) {
            const { categoryId, categoryName } = c;
            const newCategory: ChatAIModelCategory = {
                categoryId,
                categoryName,
                groups: [],
            };
            newProviders.push(newCategory);

            c.groups.forEach((g, index) => {
                const newModels: ChatAIModel[] = [];

                g.models.forEach((model) => {
                    if (isModelShow(model)) {
                        newModels.push(model);
                    }
                });

                const newGroup: ChatAIModelGroup = {
                    groupName: g.groupName,
                    models: newModels,
                };
                newCategory.groups.push(newGroup);
            });
        }

        return newProviders;
    }

    static getModelName(modelId: string) {
        const { modelsMap } = useMemoryStore.getState();
        const { custom_models } = useDataStore.getState();

        // console.log(modelId, modelsMap, custom_models);
        const model = modelsMap[modelId];
        if (model) {
            return model.displayName;
        }

        const customModel = custom_models.find(item => item.id === modelId);
        if (customModel) {
            return customModel.name;
        }

        return 'unknown';
    }

    static async setCustomModel(model: CustomModelCreate) {
        const { custom_models, update } = useDataStore.getState();
        const next = [...custom_models];

        if (model.id) {
            const index = custom_models.findIndex(item => item.id === model.id);
            if (index < 0) throw new Error('Custom model not found');

            next[index] = model as CustomModel;
        }
        else {
            model.id = 'custom:' + v7();

            next.push(model as CustomModel);
        }

        console.log('before', next);
        await update.custom_models(next);
        console.log('after', useDataStore.getState().custom_models);
    }
    static async removeCustomModel(customId: string) {
        const { custom_models, update } = useDataStore.getState();
        const next = custom_models.filter(item => item.id !== customId);

        await update.custom_models(next);
    }
}

export default ModelEvent;