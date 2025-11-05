import { RTVarConfig, RTVarDataNaive, RTVarDataType } from '@afron/types';

type Config<T extends RTVarDataType> = NonNullable<RTVarDataNaive['config'][T]>;

type ConfigMap = { [K in RTVarDataType]: NonNullable<RTVarDataNaive['config'][K]> };

const DEFAULT_CONFIGS: ConfigMap = {
    text: {
        default_value: '',
        placeholder: '',
        allow_multiline: false,
    },
    array: {
        element_type: 'text',
        minimum_length: 0,
        maximum_length: undefined,
        config: {
            text: {
                default_value: '',
                placeholder: '',
                allow_multiline: false,
            }
        },
    },
    checkbox: {
        default_value: false,
    },
    number: {
        allow_decimal: false,
    },
    select: {
        default_value: '',
        options: [],
    },
    struct: {
        fields: [],
    },
};

export function getDefaultConfig<T extends RTVarDataType>(
    type: T
): Config<T> {
    return DEFAULT_CONFIGS[type] as Config<T>;
}