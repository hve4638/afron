import { BaseRTVar, ModelConfiguration, RTVar, RTVarCreate, RTVarData, RTVarForm, RTVarFormCreate } from '@afron/types';
import { PromptInputType } from '@/types';
import { PromptVar } from './prompt-var';

/**
 * PromptEditor 내에서 사용하는 프롬프트 데이터
 */
export type PromptEditorData = {
    rtId: string;
    promptId: string;

    name: string | null;
    version: string;
    variables: PromptVar[];
    contents: string;

    config: {
        inputType: PromptInputType;
        // modelLimit : 'nothing' | '';
    }

    changed: Partial<{
        name: boolean;
        contents: boolean;
        config: boolean;
        version: boolean;
        model: boolean;
    }>;
    changedVariables: Record<string, PromptVar>;
    removedVariables: string[];
    addedVariables: string[];

    flags: Partial<{
        syncRTName: boolean;
    }>;

    promptOnly: PromptEditorPromptOnlyData;
}

export type PromptEditorPromptOnlyData = {
    enabled: false;
} | {
    enabled: true;
    model: ModelConfiguration;
}
