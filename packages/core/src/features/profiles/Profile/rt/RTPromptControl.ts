import { IACSubStorage } from 'ac-storage';

import { uuidv7 } from '@/lib/uuid';
import {
    BaseRTVar, ProfileStorageSchema,
    RTForm, RTPromptDataEditable, RTPromptMetadata,
    RTVar, RTVarCreate, RTVarData, RTVarStored, RTVarUpdate
} from '@afron/types';

import { RTFormControl } from './RTFormControl';

type PromptVar = ProfileStorageSchema.RT.Prompts['variables'][number];

export class RTPromptControl {
    #formControl: RTFormControl;

    constructor(private storage: IACSubStorage, private rtId: string) {
        this.#formControl = new RTFormControl(storage, rtId);
    }

    get formControl() {
        return this.#formControl;
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

    async getMetadata(promptId: string): Promise<RTPromptMetadata> {
        const promptAC = await this.accessPrompt(promptId);

        const name = await this.getName(promptId);
        let { id, variables, model } = promptAC.get('id', 'variables', 'model');

        return { id, name, variables, model } as RTPromptMetadata;
    }
    /**
     * 특별한 처리를 필요로 하지 않는 프롬프트 메타데이터 갱신
     */
    async setMetadata(promptId: string, input: RTPromptDataEditable): Promise<void> {
        const promptAC = await this.accessPrompt(promptId);

        if (input.name) {
            await this.setName(promptId, input.name);
            delete input.name;
        }
        promptAC.set(input);
    }

    /**
     * 프롬프트 전체 구조 가져오기
     */
    async getStruct(promptId: string): Promise<ProfileStorageSchema.RT.Prompts> {
        const promptAC = await this.accessPrompt(promptId);

        return promptAC.getAll() as ProfileStorageSchema.RT.Prompts;
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

        const { mode, prompts = [] } = indexAC.get('mode', 'prompts') as ProfileStorageSchema.RT.Metadata;
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
        const variables = await this.#getVariables(promptId);
        return variables.map(v => v.name);
    }
    async getVariables(promptId: string): Promise<RTVar[]> {
        const formAC = await this.accessForm();

        const variables = await this.#getVariables(promptId);
        return variables.map((promptVar) => {
            const { id, type, form_id, name, external_id, value } = promptVar;
            if (type === 'form') {
                const form: RTForm | null = form_id == null ? null : formAC.getOne(form_id);
                if (form != null) {
                    return {
                        id,
                        name,
                        include_type: 'form',
                        form_id: form_id as string,
                        form_name: form.display_name,
                        data: {
                            type: form.type,
                            config: form.config,
                        } as RTVarData,
                    }
                }
            }
            else if (type === 'constant') {
                return {
                    id,
                    name,
                    include_type: 'constant',
                    value,
                }
            }
            else if (type === 'external' && external_id) {
                return {
                    id,
                    name,
                    include_type: 'external',
                    external_id
                }
            }

            // fallback
            return {
                id,
                name,
                include_type: 'unknown',
            }
        });
    }
    async setVariables(promptId: string, rtVars: (RTVarCreate | RTVarUpdate)[]): Promise<string[]> {
        const promptAC = await this.accessPrompt(promptId);

        const variables = await this.#getVariables(promptId);
        const varIds: string[] = [];
        for (const v of rtVars) {
            let varId: string;
            try {
                if ('id' in v) { // 기존 항목 갱신
                    this.#updateRTVar(promptId, v, variables);

                    varId = v.id;
                }
                else { // 새로 생성
                    const newV = await this.#addRTVar(promptId, v);
                    variables.push({
                        type: newV.include_type,
                        id: newV.id,
                        name: newV.name,

                        form_id: (newV.include_type === 'form') ? newV.form_id : undefined,
                        external_id: (newV.include_type === 'external') ? newV.external_id : undefined,
                        value: (newV.include_type === 'constant') ? newV.value : undefined,
                    });

                    varId = newV.id;
                }

                varIds.push(varId);
            }
            catch (e) {
                throw e;
            }
        }

        promptAC.setOne('variables', variables);
        return varIds;
    }
    /**
     * variables 정보 가져오기
     * 
     * 하위버전 포맷 호환성 처리
     */
    async #getVariables(promptId: string): Promise<PromptVar[]> {
        const promptAC = await this.accessPrompt(promptId);

        const variables: {
            name: string;
            form_id?: string;
            [key: string]: any;
        }[] = [
            ...(promptAC.getOne('variables') ?? [])
        ];
        
        let fixed = false;
        const promptVars = variables.map<PromptVar>((v) => {
            if ('id' in v) {
                return v as PromptVar;
            }
            else {
                fixed = true;
                
                return {
                    id: uuidv7(),
                    type: 'form',
                    name: v.name,
                    form_id: v.form_id,
                }
            }
        });

        if (fixed) {
            promptAC.setOne('variables', promptVars);
        }

        return promptVars;
    }

    /**
     * RTVarCreate에 id 할당, include_type 처리 후 유효한 RTVarStore 리턴
     */
    async #addRTVar(promptId: string, rtVar: RTVarCreate): Promise<RTVarStored> {
        const varId = uuidv7();
        const base: BaseRTVar = {
            id: varId,
            name: rtVar.name,
        }

        const includeType = rtVar.include_type;
        if (includeType === 'constant') {
            return {
                ...base,

                include_type: 'constant',
                value: rtVar.value,
            }
        }
        else if (includeType === 'external') {
            return {
                ...base,

                include_type: 'external',
                external_id: rtVar.external_id,
            }
        }
        else {
            // includeType이 'form' 및 null 인 경우
            let formId: string;
            if ('form_id' in rtVar && rtVar.form_id) { // 기존 form_id 연결
                this.formControl.linkPromptVar(rtVar.form_id, { promptId, varId });

                return {
                    ...base,
                    include_type: 'form',
                    form_id: rtVar.form_id
                }
            }
            else if ('data' in rtVar && rtVar.data) { // 새 form 생성
                formId = await this.formControl.addForm({
                    display_name: rtVar.form_name ?? rtVar.name,
                    display_on_header: false,
                }, rtVar.data);

                this.formControl.linkPromptVar(formId, { promptId, varId });
                return {
                    ...base,
                    include_type: 'form',
                    form_id: formId
                };
            }
            else {
                throw new Error(`Invalid RTVar form include (id=${base.id})`);
            }
        }
    }
    /**
     * RTVarUpdate 정보를 promptVars에서 찾아 처리 후 갱신된 promptVars 리턴
     */
    async #updateRTVar(promptId: string, rtVar: RTVarUpdate, prevPromptVars: PromptVar[]): Promise<PromptVar[]> {
        const i = prevPromptVars.findIndex((pv) => pv.id === rtVar.id);
        if (i < 0) {
            throw new Error(`Prompt variable not found (id=${rtVar.id})`);
        }

        const promptVar = { ...prevPromptVars[i] };
        const nextPromptVars = [...prevPromptVars];

        if (rtVar.include_type != null) {
            if (rtVar.include_type !== promptVar.type) {
                this.#tearDownPromptVarInclude(promptId, promptVar);

                const includeType = rtVar.include_type;
                const varId = promptVar.id;
                if (includeType === 'constant') {
                    promptVar.type = 'constant';
                    promptVar.value = rtVar.value;
                }
                else if (includeType === 'external') {
                    promptVar.type = 'external';
                    promptVar.external_id = rtVar.external_id;
                }
                else {
                    // includeType이 'form' 및 null 인 경우
                    let formId: string;
                    if ('form_id' in rtVar && rtVar.form_id) { // 기존 form_id 연결
                        this.formControl.linkPromptVar(rtVar.form_id, { promptId, varId });

                        promptVar.type = 'form';
                        promptVar.form_id = rtVar.form_id;
                    }
                    else if ('data' in rtVar && rtVar.data) { // 새 form 생성
                        formId = await this.formControl.addForm({
                            display_name: (rtVar.form_name ?? rtVar.name ?? promptVar.name),
                            display_on_header: false,
                        }, rtVar.data);

                        this.formControl.linkPromptVar(formId, { promptId, varId });

                        promptVar.type = 'form';
                        promptVar.form_id = formId;
                    }
                    else {
                        throw new Error(`Invalid RTVarUpdate form include (id=${promptVar.id})`);
                    }
                }
            }
            else { // include_type이 동일한 경우
                const includeType = rtVar.include_type;
                if (includeType === 'constant') {
                    promptVar.value = rtVar.value;
                }
                else if (includeType === 'external') {
                    promptVar.external_id = rtVar.external_id;
                }
                else if (includeType === 'form') {
                    // form_id가 없는 경우는 새로운 form 생성하는 경우
                    if (rtVar.form_id == null) {
                        await this.#formControl.unlinkPromptVar(
                            promptVar.form_id as string,
                            { promptId, varId: promptVar.id }
                        );

                        const formId = await this.#formControl.addForm({
                            display_name: (rtVar.form_name ?? rtVar.name ?? promptVar.name),
                            display_on_header: false,
                        }, rtVar.data);
                        await this.#formControl.linkPromptVar(formId, { promptId, varId: promptVar.id });
                        promptVar.form_id = formId;
                    }
                    else {
                        const prevVarId = promptVar.form_id ?? promptVar.id;

                        if (rtVar.form_id == prevVarId) {
                            await this.#formControl.updateForm(
                                prevVarId,
                                (prev) => {
                                    const next = { ...prev };
                                    if (rtVar.form_name) {
                                        next.display_name = rtVar.form_name;
                                    }
                                    if (rtVar.data) {
                                        next.type = rtVar.data.type;
                                        next.config = rtVar.data.config;
                                    }

                                    return next;
                                }
                            )
                        }
                        // 이전과 form_id 다른 경우 기존 form을 언링크 후 새로운 form 연결
                        // form_name, data 에 대한 갱신도 수행
                        else {
                            await this.#formControl.unlinkPromptVar(
                                promptVar.form_id as string,
                                { promptId, varId: promptVar.id }
                            );
                            await this.#formControl.linkPromptVar(rtVar.form_id, { promptId, varId: promptVar.id });
                            promptVar.form_id = rtVar.form_id;

                            await this.#formControl.updateForm(
                                prevVarId,
                                (prev) => {
                                    const next = { ...prev };
                                    if (rtVar.form_name) {
                                        next.display_name = rtVar.form_name;
                                    }
                                    if (rtVar.data) {
                                        next.type = rtVar.data.type;
                                        next.config = rtVar.data.config;
                                    }

                                    return next;
                                }
                            )
                        }
                    }
                }
            }
        }
        return nextPromptVars;
    }
    /**
     * RTVar의 외부 include 연결 정리
     */
    async #tearDownPromptVarInclude(
        promptId: string,
        promptVar: Readonly<PromptVar>
    ) {
        const next = { ...promptVar };
        next.type = 'unknown';

        if (promptVar.type === 'constant') {
            delete next.value;

            return promptVar;
        }
        else if (promptVar.type === 'external') {
            // @TODO 추후 구현 후 적용
            // 외부 external 값에서 ref 제거 코드

            // delete next.external_id;

            return promptVar;
        }
        else if (promptVar.type === 'form') {
            await this.#formControl.unlinkPromptVar(
                promptVar.form_id as string,
                { promptId, varId: promptVar.id }
            );
            delete next.form_id;

            return next;
        }
    }
    async removeVariables(promptId: string, varIds: readonly string[]) {
        const indexAC = await this.accessIndex();
        const promptAC = await this.accessPrompt(promptId);

        const variables: { name: string, form_id: string, weak?: boolean }[] = promptAC.getOne('variables') ?? [];
        const formIds: string[] = indexAC.getOne('forms') ?? [];

        const removed: string[] = [];
        for (const varId of varIds) {
            const v = variables.find(v => v.form_id === varId);
            if (!v) continue;

            removed.push(varId);
            this.#formControl.unlinkPromptVar(
                varId,
                { promptId, varId }
            );
        }

        const filteredVars = variables.filter((v) => !removed.includes(v.form_id));
        promptAC.setOne('variables', filteredVars);

        const filteredIds = formIds.filter((id) => !removed.includes(id));
        indexAC.setOne('forms', filteredIds);
    }
}