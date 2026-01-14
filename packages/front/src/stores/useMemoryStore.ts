import { ChatAIModel, ChatAIModelData, CustomModel, VersionInfo } from '@afron/types';
import { create } from 'zustand';

type MemoryStates = {
    profileId: string | null;
    allModels: ChatAIModelData;
    modelsMap: Record<string, ChatAIModel>;
    customModels: CustomModel[];
    version: string;
    availableVersion: VersionInfo | null;
}

const useMemoryStore = create<MemoryStates>(() => ({
    profileId: null,
    allModels: [],
    modelsMap: {},
    customModels: [],
    availableVersion: null,
    version: 'unknown',
}));

export default useMemoryStore;