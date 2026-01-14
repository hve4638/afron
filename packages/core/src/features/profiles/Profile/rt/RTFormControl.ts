import { uuidv7 } from '@/lib/uuid';
import { BaseRTForm, RTForm, RTFormRef, RTVar, RTVarData } from '@afron/types';
import { IACSubStorage } from 'ac-storage';

type RTVarFormIncluded = RTVar & { include_type: 'form' };

/**
 * 내부적으로 사용하는 RT Form 제어 클래스
 */
export class RTFormControl {
    constructor(private storage: IACSubStorage, private rtId: string) {

    }

    async #accessIndex() {
        return await this.storage.accessAsJSON(`${this.rtId}:index.json`);
    }
    async #accessForm() {
        return await this.storage.accessAsJSON(`${this.rtId}:form.json`);
    }

    /**
     * 새로운 form 추가
     * 
     * @return form_id 리턴
     */
    async addForm(baseForm: BaseRTForm, varData: RTVarData): Promise<string> {
        const indexAC = await this.#accessIndex();
        const formAC = await this.#accessForm();

        const formId = uuidv7();
        const form: RTForm = {
            ...baseForm,
            ...varData,
            id: formId,
            refs: [],
        }

        formAC.setOne(formId, form);

        const formIds = indexAC.getOne('forms') ?? [];
        indexAC.setOne('forms', [...formIds, formId]);

        return formId;
    }

    async updateForm(formId: string, updater: (prev: RTForm) => RTForm) {
        const formAC = await this.#accessForm();
        const form = formAC.getOne(formId);
        if (form == null) {
            throw new Error(`Form not found (${formId})`);
        }
        const nextForm = updater(form);

        formAC.setOne(formId, nextForm);
    }
    async removeForm(formId: string): Promise<void> {
        const formAC = await this.#accessForm();

        formAC.removeOne(formId);
    }

    /**
     * 프롬프트 변수와 form 연결
     * 
     * @return form_id가 추가된 PromptVar
     */
    async linkPromptVar(
        formId: string,
        { promptId, varId }: {
            promptId: string,
            varId: string,
        }
    ) {
        const formAC = await this.#accessForm();
        const form: RTForm = formAC.getOne(formId);
        if (form == null) {
            throw new Error(`Form not found (${formId})`);
        }

        const newRefs: RTFormRef[] = [
            ...form.refs,
            {
                type: 'prompt',
                prompt_id: promptId,
                variable_id: varId,
            }
        ];
        formAC.setOne(`${formId}:refs`, newRefs);
    }

    /**
     * 전역 변수와 form 연결
     * 
     * @return form_id가 추가된 PromptVar
     */
    async linkGlobalVar(formId: string, rtVar: RTVar): Promise<RTVarFormIncluded> {
        const formAC = await this.#accessForm();
        const form: RTForm = formAC.getOne(formId);
        if (form == null) {
            throw new Error(`Form not found (${formId})`);
        }

        const newRefs: RTFormRef[] = [
            ...form.refs,
            {
                type: 'global',
                variable_id: rtVar.id,
            }
        ];
        formAC.setOne(`${formId}:refs`, newRefs);

        return {
            ...rtVar,
            form_id: formId
        } as RTVarFormIncluded;
    }

    /**
     * form에서 프롬프트 변수 연결 해제
     * 
     * 마지막 참조가 제거되면 form도 삭제
     * 
     * @return include가 제거된 PromptVar
     */
    async unlinkPromptVar(
        formId: string,
        { promptId, varId }: { promptId: string; varId: string; }
    ) {
        const formAC = await this.#accessForm();
        const form: RTForm = formAC.getOne(formId);
        if (form == null) {
            throw new Error(`Form not found (${formId})`);
        }

        const newRefs = form.refs.filter((ref) => !(
            ref.type === 'prompt'
            && ref.prompt_id === promptId
            && ref.variable_id === varId
        ));
        
        if (newRefs.length > 0) {
            formAC.setOne(`${formId}:refs`, newRefs);
        }
        else {
            formAC.removeOne(formId);
        }
    }
}