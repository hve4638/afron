export namespace FormConfig {
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
        fields: {
            type: 'text' | 'number' | 'checkbox' | 'select';
            name: string;
            display_name: string;
            config: {
                text?: Text;
                number?: Number;
                checkbox?: Checkbox;
                select?: Select;
            }
        }[];
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
