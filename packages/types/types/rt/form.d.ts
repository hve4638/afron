import { ProfileStorage } from '../storage-struct';
import { ProfileStorage } from '../storage-struct';
import { RTVarDataNaive } from '../rt-var';

export type RTPromptMetadata = Pick<ProfileStorage.RT.Prompt,
    'id' | 'name' | 'variables' | 'model'
>

export type RTPromptDataEditable = {
    name?: string;
    model?: {
        temperature?: number;
        top_p?: number;
        max_tokens?: number;
        use_thinking?: boolean;
        thinking_tokens?: number;
    };
    contents?: string;
}

export type BaseRTForm = {
    display_name: string;
    display_on_header: boolean;
}

export type RTForm = {
    id: string;
    refs: RTFormRef[];
} & BaseRTForm
    & RTVarDataNaive;

/**
 * 이 Form을 참조하는 RT 변수
*/
export type RTFormRef = {
    type: 'prompt' | 'global';
    prompt_id?: string;
    variable_id: string;
};

export { }