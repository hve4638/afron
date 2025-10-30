import { RTVar, RTVarConfig, RTVarForm } from '@afron/types';

export function getRTVarDefaultValue(rtVar: RTVarForm) {
    switch (rtVar.data.type) {
        case 'text':
        case 'number':
        case 'select':
        case 'checkbox':
            return rtVar.data.config[rtVar.data.type].default_value;
        case 'array':
            return [];
        case 'struct':
            {
                const data = rtVar.data.config.struct;
                const fields = {};
                for (const f of data.fields) {
                    fields[f.name] = getFieldDefaultValue(f);
                }
                return fields;
            }
    }
}

function getFieldDefaultValue(field: RTVarConfig.StructField) {
    switch (field.type) {
        case 'text':
        case 'number':
        case 'select':
        case 'checkbox':
            return field.config[field.type]?.default_value;
    }
}