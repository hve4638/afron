import { ProfileStorage } from '../storage-struct';
import { RTVarDataNaive, RTVarData } from '../rt-var';

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

export type RTFormNaive = BaseRTForm & RTVarDataNaive & {
    id: string;
    refs: RTFormRef[];
};
export type RTForm = BaseRTForm & RTVarData & {
    id: string;
    refs: RTFormRef[];
};

/** 이 Form을 참조하는 RT 변수 */
export type RTFormRef = {
    type: 'prompt' | 'global';
    prompt_id?: string;
    variable_id: string;
};

export { }