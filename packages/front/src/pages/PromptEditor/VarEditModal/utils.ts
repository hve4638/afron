import { RTVar, RTVarData, RTVarDataNaive } from "@afron/types";

export function dropdownItem(name: string, value: string) {
    return { name, value };
}

export function initRTVar(mutableRtVar: RTVar | undefined | null) {
    if (mutableRtVar == null) return;

    mutableRtVar.name ??= 'new-var';
    mutableRtVar.include_type ??= 'form';
    if (mutableRtVar.include_type === 'form') {
        mutableRtVar.form_name ??= 'New Variable';
        mutableRtVar.data ??= { type: 'text', config: {} as any };
        mutableRtVar.data.type ??= 'text';
        mutableRtVar.data.config ??= initRTVarFormData(mutableRtVar.data.type);
    }
}

export function initRTVarFormData(formType: RTVarDataNaive['type']): RTVarData['config'] {
    switch (formType) {
        case 'text':
            return {
                text: {
                    default_value: '',
                    placeholder: '',
                    allow_multiline: false,
                }
            };
            break;
        case 'number':
            return {
                number: {
                    allow_decimal: false
                }
            };
            break;
        case 'checkbox':
            return {
                checkbox: {
                    default_value: false
                }
            };
            break;
        case 'select':
            return {
                select: {
                    default_value: '',
                    options: [
                        {
                            name: '선택 1',
                            value: 'select-1',
                        }
                    ]
                }
            }
        case 'struct':
            return {
                struct: {
                    fields: []
                }
            }
            break;
        case 'array':
            return {
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
                    }
                }
            }
    }
}