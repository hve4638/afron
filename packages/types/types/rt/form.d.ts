import { ProfileStorage } from '../storage-struct';

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

/**
 * 실제 내부에서 저장되는 Form 정의
 */
export type RTForm = {
    type: 'text' | 'number' | 'checkbox' | 'select' | 'array' | 'struct';
    id: string;
    display_name: string;
    display_on_header: boolean;

    config: {
        text?: RTFormConfig.Text;
        number?: RTFormConfig.Number;
        checkbox?: RTFormConfig.Checkbox;
        select?: RTFormConfig.Select;
        array?: RTFormConfig.Array;
        struct?: RTFormConfig.Struct;
    }
}

export namespace RTFormConfig {
    type Text = {
        default_value?: string;
        placeholder: string;
        allow_multiline: boolean;
    }
    type Number = {
        default_value?: number;
        minimum_value?: number;
        maximum_value?: number;
        allow_decimal: boolean;
    }
    type Checkbox = {
        default_value: boolean;
    }
    type Select = {
        default_value?: string;
        options: {
            name: string;
            value: string;
        }[];
    }
    type Struct = {
        fields: StructField[];
    }
    type StructField = {
        type: 'text' | 'number' | 'checkbox' | 'select';
        name: string;
        display_name: string;
        config: {
            text?: Text;
            number?: Number;
            checkbox?: Checkbox;
            select?: Select;
        }
    }
    type Array = {
        minimum_length?: number;
        maximum_length?: number;
        element_type: 'text' | 'number' | 'checkbox' | 'select' | 'struct';
        config: {
            text?: Text;
            number?: Number;
            checkbox?: Checkbox;
            select?: Select;
            struct?: Struct;
        };
    }
}

// export type RTFormText = {
//     default_value: string;
//     placeholder: string;
//     allow_multiline: boolean;
// }
// export type RTFormNumber = {
//     default_value: number;
//     minimum_value?: number;
//     maximum_value?: number;
//     allow_decimal: boolean;
// }
// export type RTFormCheckbox = {
//     default_value: boolean;
// }
// export type RTFormSelect = {
//     default_value: string;
//     options: {
//         name: string;
//         value: string;
//     }[];
// }
// export type RTFormStruct = {
//     fields: RTFormStructField[];
// }
// export type RTFormStructField = {
//     type: 'text' | 'number' | 'checkbox' | 'select';
//     name: string;
//     display_name: string;

//     config: {
//         text?: RTFormText;
//         number?: RTFormNumber;
//         checkbox?: RTFormCheckbox;
//         select?: RTFormSelect;
//     }
// }
// export type RTFormArray = {
//     minimum_length?: number;
//     maximum_length?: number;
//     element_type: 'text' | 'number' | 'checkbox' | 'select' | 'struct';
//     config: {
//         text?: RTFormText;
//         number?: RTFormNumber;
//         checkbox?: RTFormCheckbox;
//         select?: RTFormSelect;
//         struct?: RTFormStruct;
//     }
// }

export { }