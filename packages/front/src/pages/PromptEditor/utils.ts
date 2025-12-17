import { PromptVar } from '@/types/prompt-var';
import { RTVar, RTVarCreate, RTVarData, RTVarDataNaive, RTVarUpdate } from '@afron/types';

export function convertRTVarToPromptVar(rtVar: RTVar): PromptVar {
    if (rtVar.include_type === 'external') {
        return {
            id: rtVar.id,
            name: rtVar.name,
            include_type: 'external',
            external_id: rtVar.external_id,
        }
    }
    else if (rtVar.include_type === 'constant') {
        return {
            id: rtVar.id,
            name: rtVar.name,
            include_type: 'constant',
            value: rtVar.value,
        };
    }
    else if (rtVar.include_type === 'form') {
        return {
            id: rtVar.id,
            name: rtVar.name,
            include_type: 'form',
            form_id: rtVar.form_id,
            form_name: rtVar.form_name,
            data: rtVar.data,
        };
    }
    else {
        return {
            id: rtVar.id,
            name: rtVar.name,
            include_type: 'unknown',
        }
    }
}

export function convertPromptVarToRTVar(promptVar: PromptVar): RTVarCreate | RTVarUpdate {
    if ('created' in promptVar) {
        const base: any = { ...promptVar };
        delete base.id;

        return base as RTVarCreate;
    }
    else {
        const base: RTVarUpdate = {
            id: promptVar.id,
            name: promptVar.name,
        };

        switch (promptVar.include_type) {
            case 'external':
                return {
                    ...base,
                    include_type: 'external',
                    external_id: promptVar.external_id,
                };
            case 'constant':
                return {
                    ...base,
                    include_type: 'constant',
                    value: promptVar.value,
                };
            case 'form':
                if (!validateRTVarDataNaive(promptVar.data)) {
                    /// @TODO: 에러 처리 대신 기본값 넣어주는게 나을수도
                    throw new Error('Invalid RTVarDataNaive in PromptVar');
                }

                if (promptVar.form_id) {
                    return {
                        ...base,
                        include_type: 'form',
                        form_id: promptVar.form_id,
                        form_name: promptVar.form_name,
                        data: promptVar.data,
                    }
                }
                else {
                    return {
                        ...base,
                        include_type: 'form',
                        form_name: promptVar.form_name,
                        data: promptVar.data,
                    }
                }
            case 'unknown':
                return base;
        }
    }
}

export function validateRTVarDataNaive(data: RTVarDataNaive): data is RTVarData {
    return (
        data.type &&
        data.config &&
        data.config[data.type] !== undefined
    )
}
