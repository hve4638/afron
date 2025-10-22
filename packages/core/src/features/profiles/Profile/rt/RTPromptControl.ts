import { PromptVarParser, RTFormParser } from '@/features/var-transformers';
import { uuidv7 } from '@/lib/uuid';
import { ProfileStorage, RTForm } from '@afron/types';
import { IACSubStorage } from 'ac-storage';

export class RTPromptControl {
    constructor(private storage: IACSubStorage, private rtId: string) {

    }

    private async accessIndex() {
        return await this.storage.accessAsJSON(`${this.rtId}:index.json`);
    }
    private async accessPrompt(promptId: string) {
        return await this.storage.accessAsJSON(`${this.rtId}:prompts:${promptId}`);
    }
    private async accessForm() {
        return await this.storage.accessAsJSON(`${this.rtId}:form.json`);
    }
    private async accessFlow() {
        return await this.storage.accessAsJSON(`${this.rtId}:flow.json`);
    }

    async getName(promptId: string): Promise<string> {
        const indexAC = await this.accessIndex();
        const promptAC = await this.accessPrompt(promptId);

        const { name, mode } = indexAC.get('name', 'mode');
        if (mode === 'prompt_only') {
            // prompt_only 모드에서는 rt 이름과 prompt 명이 동일
            return name;
        }
        else {
            return promptAC.getOne('name');
        }
    }
    async setName(promptId: string, name: string): Promise<void> {
        const indexAC = await this.accessIndex();
        const promptAC = await this.accessPrompt(promptId);

        promptAC.setOne('name', name);

        const { mode, prompts = [] } = indexAC.get('mode', 'prompts') as ProfileStorage.RT.Index;
        if (mode === 'prompt_only') {
            // prompt_only 모드에서는 rt 이름과 prompt 명이 동일
            indexAC.setOne('name', name);
        }
        else {
            // index.json 의 prompts 목록 갱신
            const index = prompts.findIndex(p => p.id === promptId);

            if (index >= 0) {
                prompts[index] = { ...prompts[index], name };
                indexAC.setOne('prompts', prompts);
            }
            else {
                throw new Error(`Invalid prompt access (prompt_id=${promptId})`);
            }
        }
    }

    async getContents(promptId: string): Promise<string> {
        const promptAC = await this.accessPrompt(promptId);

        return promptAC.getOne('contents');
    }
    async setContents(promptId: string, contents: string): Promise<void> {
        const promptAC = await this.accessPrompt(promptId);

        promptAC.setOne('contents', contents);
    }


    async getVariableNames(promptId: string): Promise<string[]> {
        const promptAC = await this.accessPrompt(promptId);

        const variableNames: string[] = promptAC.getOne('variables') ?? [];
        return variableNames;
    }
    async getVariables(promptId: string): Promise<PromptVar[]> {
        const promptAC = await this.accessPrompt(promptId);
        const formAC = await this.accessForm();

        const variables: { form_id: string, name: string }[] = promptAC.getOne('variables') ?? [];
        return variables.map(({ form_id, name }) => {
            const form: RTForm = formAC.getOne(form_id);

            const promptVar = RTFormParser.toPromptVar(form);
            promptVar.id = form_id;
            promptVar.name = name;

            return promptVar;
        });
    }

    /**
     * 프롬프트 변수 추가 & 갱신
     * 
     * promptVars 요소에서 없는 원소는 id 할당 후 추가, id가 존재하면 상태만 갱신
     * @return 
     */
    async setPromptVariables(promptId: string, promptVars: PromptVar[]): Promise<string[]> {
        const promptAC = await this.accessPrompt(promptId);
        const isPromptOnlyMode = (promptId === 'default');

        const variables: { name: string; form_id: string; }[] = promptAC.getOne('variables') ?? [];
        const varIds: string[] = [];
        for (const promptVar of promptVars) {
            let formId: string = '';
            try {
                if (!promptVar.id) { // 새로 생성
                    formId = await this.#addForm(promptVar);

                    variables.push({ name: promptVar.name, form_id: formId });
                }
                else { // 기존 항목 갱신
                    formId = promptVar.id;

                    const v = variables.find(v => v.form_id === formId);
                    if (v) {
                        await this.#updateForm(formId, promptVar);
                        v.name = promptVar.name;
                    }
                    else {
                        throw new Error(`Form ID '${formId}' not found in prompt variables`);
                    }
                }

                varIds.push(formId);
            }
            catch (e) {
                promptVar.id ??= 'unknown';
                const form = PromptVarParser.toRTForm(promptVar);

                console.error(`Failed to set prompt variables : ${promptVar.name} (${formId})`);
                console.error('variable : ', promptVar);
                console.error('form (transition) : ', form);

                throw e;
            }
        }

        promptAC.setOne('variables', variables);
        return varIds;
    }
    async #addPromptVariable(promptVar: PromptVar, ) {

        return {
            variables.push({ name: promptVar.name, form_id: formId });
        }
    }
    async removePromptVariables(promptId: string, varIds: string[]) {
        const indexAC = await this.accessIndex();
        const promptAC = await this.accessPrompt(promptId);

        const variables: { name: string, form_id: string, weak?: boolean }[] = promptAC.getOne('variables') ?? [];
        const formIds: string[] = indexAC.getOne('forms') ?? [];

        const removed: string[] = [];
        for (const varId of varIds) {
            const v = variables.find(v => v.form_id === varId);
            if (!v) continue;

            removed.push(varId);
            if (!v.weak) {
                this.#removeForm(varId);
            }
        }

        const filteredVars = variables.filter((v) => !removed.includes(v.form_id));
        promptAC.setOne('variables', filteredVars);

        const filteredIds = formIds.filter((id) => !removed.includes(id));
        indexAC.setOne('forms', filteredIds);
    }

    /** 겹치지 않음을 보장하는 새로운 form-id 생성해 리턴 */
    async #getNewFormId(): Promise<string> {
        const formAC = await this.accessForm();

        let formId: string;
        do {
            formId = uuidv7();
        } while (formAC.existsOne(formId));

        return formId;
    }

    async #addForm(promptVar: PromptVar): Promise<string> {
        const indexAC = await this.accessIndex();
        const formAC = await this.accessForm();

        const formId = await this.#getNewFormId();
        promptVar.id = formId;

        const form = PromptVarParser.toRTForm(promptVar);
        formAC.setOne(formId, form);

        const formIds = indexAC.getOne('forms') ?? [];
        indexAC.setOne('forms', [...formIds, formId]);

        return formId;
    }
    async #updateForm(formId: string, promptVar: PromptVar) {
        const formAC = await this.accessForm();

        promptVar.id = formId;
        const form: ProfileStorage.RT.Form = PromptVarParser.toRTForm(promptVar);

        formAC.setOne(formId, form);
    }
    async #removeForm(formId: string): Promise<void> {
        const formAC = await this.accessForm();

        formAC.removeOne(formId);
    }
}