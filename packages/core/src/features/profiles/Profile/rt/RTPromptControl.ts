import { StorageStruct } from '@afron/types';
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

        const { mode, prompts = [] } = indexAC.get('mode', 'prompts') as StorageStruct.RT.Index;
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
    
    async getPromptContents(promptId: string): Promise<string> {
        const promptAC = await this.accessPrompt(promptId);

        return promptAC.getOne('contents');
    }
    async setPromptContents(promptId: string, contents: string): Promise<void> {
        const promptAC = await this.accessPrompt(promptId);

        promptAC.setOne('contents', contents);
    }

    async getPromptVariableNames(promptId: string): Promise<string[]> {
        const promptAC = await this.accessPrompt(promptId);

        const variableNames: string[] = promptAC.getOne('variables') ?? [];
        return variableNames;
    }
    async getPromptVariables(promptId: string): Promise<PromptVar[]> {
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
}