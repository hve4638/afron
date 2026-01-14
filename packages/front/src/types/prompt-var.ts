import { RTVarDataNaive } from '@afron/types';

export type BasePromptVar = {
    /** 변수 ID, 변수 생성 시 임시 ID 할당 */
    id: string;
    name: string;
    create?: boolean;
}
export type PromptVarForm = BasePromptVar & {
    include_type: 'form';
    form_id?: string | null;
    form_name: string;
    data: RTVarDataNaive;
}
export type PromptVarExternal = BasePromptVar & {
    include_type: 'external';
    external_id: string;
}
export type PromptVarConstant = BasePromptVar & {
    include_type: 'constant';
    value: any;
}
export type PromptVarUnknown = BasePromptVar & {
    include_type: 'unknown';
}

export type PromptVar = (
    PromptVarForm |
    PromptVarExternal |
    PromptVarConstant |
    PromptVarUnknown
);