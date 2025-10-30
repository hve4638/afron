import type {
    PromptEditorData,
    PromptInputType
} from '@/types';
import { PromptVar } from '@/types/prompt-var';
import { RTVar, RTVarCreate, RTVarFormUpdate, RTVarUpdate } from '@afron/types';

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

export function getDefaultPromptEditorData(): PromptEditorData {
    return {
        rtId: '',
        promptId: '',

        name: null,
        version: '1.0.0',
        variables: [],
        changedVariables: {},
        removedVariables: [],
        contents: '',
        config: {
            inputType: 'normal',
        },

        changed: {},
        flags: {},
        promptOnly: {
            enabled: true,
            model: {
                stream: false,
                temperature: 1.0,
                top_p: 1.0,
                max_tokens: 1024,
                use_thinking: false,
                thinking_tokens: 1024,

                safety_settings: {
                    HARM_CATEGORY_CIVIC_INTEGRITY: 'OFF',
                    HARM_CATEGORY_DANGEROUS_CONTENT: 'OFF',
                    HARM_CATEGORY_HARASSMENT: 'OFF',
                    HARM_CATEGORY_HATE_SPEECH: 'OFF',
                    HARM_CATEGORY_SEXUALLY_EXPLICIT: 'OFF',
                },
            },
        }
    }
}