import { useEffect } from 'react';

import ProfilesAPI from '@/api/profiles';
import { useGlobalConfigStore, useProfileAPIStore } from '@/stores';

import { useStartupStore } from '../store';
import useMemoryStore from '@/stores/useMemoryStore';
import LocalAPI from '@/api/local';
import { ChatAIModel } from '@afron/types';

function LoadDataStep() {
    const apiState = useProfileAPIStore();
    const { update } = useStartupStore();

    useEffect(() => {
        const promises = [
            ProfilesAPI.getLast()
                .then((lastProfileId) => {
                    if (lastProfileId != null) {
                        useMemoryStore.setState({ profileId: lastProfileId });
                        apiState.setAPI(lastProfileId);
                    }
                })
                .catch((err) => {
                    console.error('Failed to load last profile:', err);
                }),
            LocalAPI.general.getAvailableVersion()
                .then((availableVersion) => {
                    useMemoryStore.setState({ availableVersion })
                })
                .catch(() => {
                    // nothing to do
                }),
            LocalAPI.general.getCurrentVersion()
                .then((version) => {
                    useMemoryStore.setState({ version })
                }),
            LocalAPI.general.getChatAIModels()
                .then((chatAIModelData) => {
                    const modelsMap: Record<string, ChatAIModel> = {};
                    for (const provider of chatAIModelData) {
                        for (const category of provider.groups) {
                            for (const model of category.models) {
                                modelsMap[model.metadataId] = model;
                            }
                        }
                    }
                    useMemoryStore.setState({ allModels: chatAIModelData, modelsMap });
                }),
            useGlobalConfigStore.getState().refetchAll(),
        ];

        Promise.all(promises)
            .then(() => {
                update.nextStep();
            });
    }, []);

    return null;
}

export default LoadDataStep;
