import { uuidv7 } from '@/lib/uuid';
import { RTForm, RTVarConfig } from '@afron/types';

class PromptVarParser {
    /**
     * PromptVar -> RTForm 변환
     * 
     * 
    */
    static toRTForm(promptVar: PromptVar): RTForm {
        let formId: string
        if (promptVar.form_id != null) {
            formId = promptVar.form_id;
        }
        else {
            formId = uuidv7();
        }
        
        const form: RTForm = {
            type: promptVar.type,
            id: formId,
            display_name: promptVar.display_name,
            display_on_header: false,

            config: {}
        }

        switch (promptVar.type) {
            case 'text':
                form.config.text = this.#parseText(promptVar);
                break;
            case 'number':
                form.config.number = this.#parseNumber(promptVar);
                break;
            case 'checkbox':
                form.config.checkbox = this.#parseCheckbox(promptVar);
                break;
            case 'select':
                form.config.select = this.#parseSelect(promptVar);
                break;
            case 'struct':
                form.config.struct = this.#parseStruct(promptVar);
                break;
            case 'array':
                form.config.array = this.#parseArray(promptVar);
                break;
        }
        return form;
    }

    static #parseText(promptVar: PromptVarText): RTVarConfig.Text {
        return {
            default_value: promptVar.default_value || '',
            placeholder: promptVar.placeholder ?? '',
            allow_multiline: promptVar.allow_multiline ?? false,
        }
    }
    static #parseNumber(promptVar: PromptVarNumber): RTVarConfig.Number {
        return {
            default_value: promptVar.default_value || 0,
            minimum_value: promptVar.minimum_value,
            maximum_value: promptVar.maximum_value,
            allow_decimal: promptVar.allow_decimal ?? false,
        }
    }
    static #parseCheckbox(promptVar: PromptVarCheckbox): RTVarConfig.Checkbox {
        return {
            default_value: promptVar.default_value || false,
        }
    }
    static #parseSelect(promptVar: PromptVarSelect): RTVarConfig.Select {
        return {
            default_value: promptVar.default_value || '',
            options: promptVar.options.map((item) => ({
                name: item.name,
                value: item.value,
            })),
        }
    }
    static #parseStruct(promptVar: PromptVarStruct): RTVarConfig.Struct {
        const fields = promptVar.fields.map(
            (field) => {
                const subform: RTVarConfig.StructField = {
                    type: field.type as 'text' | 'number' | 'checkbox' | 'select',
                    name: field.name,
                    display_name: field.display_name,
                    config: {},
                };

                switch (field.type) {
                    case 'text':
                        subform.config.text = this.#parseText(field);
                        break;
                    case 'number':
                        subform.config.number = this.#parseNumber(field);
                        break;
                    case 'checkbox':
                        subform.config.checkbox = this.#parseCheckbox(field);
                        break;
                    case 'select':
                        subform.config.select = this.#parseSelect(field);
                        break;
                }
                return subform;
            }
        );

        return { fields };
    }
    static #parseArray(promptVar: PromptVarArray): RTVarConfig.Array {
        const arrayConfig: RTVarConfig.Array = {
            element_type: promptVar.element.type,
            minimum_length: promptVar.minimum_length,
            maximum_length: promptVar.maximum_length,
            config: {}
        }

        switch (promptVar.element.type) {
            case 'text':
                arrayConfig.config.text = this.#parseText(promptVar.element);
                break;
            case 'number':
                arrayConfig.config.number = this.#parseNumber(promptVar.element);
                break;
            case 'checkbox':
                arrayConfig.config.checkbox = this.#parseCheckbox(promptVar.element);
                break;
            case 'select':
                arrayConfig.config.select = this.#parseSelect(promptVar.element);
                break;
            case 'struct':
                arrayConfig.config.struct = this.#parseStruct(promptVar.element);
                break;
        }

        return arrayConfig;
    }
}

export default PromptVarParser;