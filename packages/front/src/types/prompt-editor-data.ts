import { ModelConfiguration } from '@afron/types';
import { PromptInputType } from '@/types';
import { PromptVar } from './prompt-var';

/**
 * PromptEditor 내에서 사용하는 프롬프트 데이터
 */
export type PromptData = {
    rtId: string;
    promptId: string;

    name: string | null;
    version: string;
    variables: PromptVar[];
    contents: string;

    config: Record<string, never>; // 추후 사용
    promptOnly: PromptEditorPromptOnlyData;
    flags: Partial<{
        syncRTName: boolean;
    }>;

    changed: Partial<{
        name: boolean;
        contents: boolean;
        config: boolean;
        version: boolean;
        model: boolean;
        inputType: boolean;
    }>;
    changedVariables: Record<string, PromptVar>;
    removedVariables: string[];
    addedVariables: string[];
}

export type PromptEditorPromptOnlyData = {
    enabled: false;
} | {
    enabled: true;
    model: ModelConfiguration;
    inputType: PromptInputType;
}