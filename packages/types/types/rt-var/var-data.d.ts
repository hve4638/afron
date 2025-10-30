export type RTVarDataNaive = {
    type: 'text' | 'number' | 'checkbox' | 'select' | 'array' | 'struct';

    config: {
        text?: RTVarConfig.Text;
        number?: RTVarConfig.Number;
        checkbox?: RTVarConfig.Checkbox;
        select?: RTVarConfig.Select;
        array?: RTVarConfig.Array;
        struct?: RTVarConfig.Struct;
    }
}


/**
 * RT 변수 데이터 타입 및 제한 정의
 * 
 * RTForm 및 PromptVar에서 사용
 */
export type RTVarData = {
    type: 'text';
    config: {
        text: RTVarConfig.Text;
    }
} | {
    type: 'number';

    config: {
        number: RTVarConfig.Number;
    }
} | {
    type: 'checkbox';

    config: {
        checkbox: RTVarConfig.Checkbox;
    }
} | {
    type: 'select';

    config: {
        select: RTVarConfig.Select;
    }
} | {
    type: 'array';

    config: {
        array: RTVarConfig.Array;
    }
} | {
    type: 'struct';

    config: {
        struct: RTVarConfig.Struct;
    }
};

export namespace RTVarConfig {
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

export { }