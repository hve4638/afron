import { ProfileStorage } from '../storage-struct';

///@TODO: 과거 타입 정의, StorageStruct.RT 기반으로 다시 변경하기
export type RTIndex = ProfileStorage.RT.Index;

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

export type RTForm = {
    type: 'text' | 'number' | 'checkbox' | 'select' | 'array' | 'struct';
    id: string;
    display_name: string;
    display_on_header: boolean;

    config: {
        text?: RTFormText;
        number?: RTFormNumber;
        checkbox?: RTFormCheckbox;
        select?: RTFormSelect;
        array?: RTFormArray;
        struct?: RTFormStruct;
    }
}

export type RTFormText = {
    default_value: string;
    placeholder: string;
    allow_multiline: boolean;
}
export type RTFormNumber = {
    default_value: number;
    minimum_value?: number;
    maximum_value?: number;
    allow_decimal: boolean;
}
export type RTFormCheckbox = {
    default_value: boolean;
}
export type RTFormSelect = {
    default_value: string;
    options: {
        name: string;
        value: string;
    }[];
}
export type RTFormStruct = {
    fields: RTFormStructField[];
}
export type RTFormStructField = {
    type: 'text' | 'number' | 'checkbox' | 'select';
    name: string;
    display_name: string;

    config: {
        text?: RTFormText;
        number?: RTFormNumber;
        checkbox?: RTFormCheckbox;
        select?: RTFormSelect;
    }
}
export type RTFormArray = {
    minimum_length?: number;
    maximum_length?: number;
    element_type: 'text' | 'number' | 'checkbox' | 'select' | 'struct';
    config: {
        text?: RTFormText;
        number?: RTFormNumber;
        checkbox?: RTFormCheckbox;
        select?: RTFormSelect;
        struct?: RTFormStruct;
    }
}

export { }