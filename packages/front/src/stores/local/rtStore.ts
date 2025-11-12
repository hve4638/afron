import { create } from 'zustand'
import useProfileAPIStore from '@/stores/useProfileAPIStore';
import { ProfileStorage, RTFlowData, RTPromptDataEditable, RTPromptMetadata, RTVar, RTVarCreate, RTVarUpdate } from '@afron/types';

// @TODO: context로 옮기는게 나을지 검토

export interface RTState {
    id: string; // string | null 에서 string 으로 변경했는데 잠시 null인 경우가 있을 수 있으니 검토 필요
    get: {
        metadata(): Promise<ProfileStorage.RT.Index>;

        promptMetadata(promptId: string): Promise<RTPromptMetadata>;
        promptName(promptId: string): Promise<string>;
        promptVars(promptId: string): Promise<RTVar[]>;
        promptContents(promptId: string): Promise<string>;

        workflowNodes: () => Promise<RTFlowData>;
    };
    update: {
        metadata(data: Partial<ProfileStorage.RT.Index>): Promise<void>;
        promptMetadata(promptId: string, data: RTPromptDataEditable): Promise<void>;

        promptName(promptId: string, name: string): Promise<void>;
        promptVars(promptId: string, vars: (RTVarCreate | RTVarUpdate)[]): Promise<string[]>;
        promptContents(promptId: string, text: string): Promise<void>;

        workflowNodes: (flowData: RTFlowData) => Promise<void>;
    };
    remove: {
        promptVars(promptId: string, varId: string[]): Promise<void>
    }
}

function getRTAPI(rtId: string | null) {
    if (rtId == null) throw new Error('rtId is not provided');

    const { api } = useProfileAPIStore.getState();
    return api.rt(rtId);
}

export function createRTStore(rtId: string) {
    return create<RTState>((set, get) => ({
        id: rtId,
        get: {
            metadata: async () => {
                const rtAPI = getRTAPI(get().id);

                return await rtAPI.getMetadata();
            },

            promptMetadata: async (promptId: string) => {
                const rtAPI = getRTAPI(get().id);

                return await rtAPI.prompt.getMetadata(promptId);
            },
            promptName: async (promptId: string) => {
                const rtAPI = getRTAPI(get().id);

                return await rtAPI.prompt.getName(promptId);
            },
            promptVars: async (promptId: string) => {
                const rtAPI = getRTAPI(get().id);

                return await rtAPI.prompt.getVariables(promptId);
            },
            promptContents: async (promptId: string) => {
                const rtAPI = getRTAPI(get().id);

                return await rtAPI.prompt.getContents(promptId);
            },

            workflowNodes: async () => {
                const rtAPI = getRTAPI(get().id);

                return await rtAPI.workflow.getNodes();
            }
        },
        update: {
            metadata: async (metadata: Partial<ProfileStorage.RT.Index>) => {
                const rtAPI = getRTAPI(get().id);

                await rtAPI.setMetadata(metadata);
            },
            promptMetadata: async (promptId: string, data: RTPromptDataEditable) => {
                const rtAPI = getRTAPI(get().id);

                await rtAPI.prompt.setMetadata(promptId, data);
            },
            promptName: async (promptId: string, name: string) => {
                const rtAPI = getRTAPI(get().id);

                await rtAPI.prompt.setName(promptId, name);
            },
            promptVars: async (promptId: string, vars: (RTVarCreate | RTVarUpdate)[]) => {
                const rtAPI = getRTAPI(get().id);

                return await rtAPI.prompt.setVariables(promptId, vars);
            },
            promptContents: async (promptId: string, text: string) => {
                const rtAPI = getRTAPI(get().id);

                await rtAPI.prompt.setContents(promptId, text);
            },

            workflowNodes: async (flowData: RTFlowData) => {
                const rtAPI = getRTAPI(get().id);
                await rtAPI.workflow.setNodes(flowData);
            }
        },
        remove: {
            promptVars: async (promptId: string, varIds: string[]) => {
                const rtAPI = getRTAPI(get().id);
                
                await rtAPI.prompt.removeVariables(promptId, varIds);
            },
        }
    }));
}