import type {
    PromptEditorData,
    PromptInputType
} from '@/types';

/**
 * PromptVar의 default_value를 type에 맞게 수정
 * 
 * @param promptVar 
 */
export function fixPromptVar(promptVar: PromptVar) {
    switch (promptVar.type) {
        case 'text':
            if (typeof promptVar.default_value !== 'string') {
                delete promptVar.default_value;
            }
            break;
        case 'number':
            if (typeof promptVar.default_value !== 'number') {
                delete promptVar.default_value;
            }
            break;
        case 'select':
            if (typeof promptVar.default_value !== 'string') {
                delete promptVar.default_value;
                // = promptVar.options[0].value;
            }
            break;
        case 'checkbox':
            if (typeof promptVar.default_value !== 'boolean') {
                promptVar.default_value = false;
            }
            break;
        case 'array':
            fixPromptVar(promptVar.element);
            break;
        case 'struct':
            for (const field of promptVar.fields) {
                fixPromptVar(field);
            }
            break;
    }
}

export function getDefaultPromptEditorData(): PromptEditorData {
    return {
        rtId: '',
        promptId: '',

        name: null,
        version: '1.0.0',
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
        variables: [],
        changedVariables: [],
        removedVariables: [],
        contents: '',
        config: {
            inputType: 'normal',
        },

        changed: {},
        flags: {},
    }
}