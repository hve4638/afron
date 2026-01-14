import { ProfileStorage, RTMetadata } from '@afron/types';

import { ProfileAPI } from '@/api/profiles';
import { useProfileAPIStore } from '@/stores';

import { directory, node, Tree } from '@/components/TreeView';
import { genUntil } from '@/utils/genUntil';

export class RTWorkflowModel {
    #api: ProfileAPI;
    #rtId: string;

    #prompts: ProfileStorage.RT.PromptOrder | null = null;

    private constructor(rtId: string) {
        const { api } = useProfileAPIStore.getState();
        this.#api = api;
        this.#rtId = rtId;
    }

    static From(rtId: string) {
        return new RTWorkflowModel(rtId);
    }

    /**
     * 원격에서 현재 RT의 프롬프트 목록 반환, 캐시 적용됨
    */
    async #fetchPrompts(refetch: boolean = false): Promise<ProfileStorage.RT.PromptOrder> {
        if (this.#prompts && !refetch) {
            return this.#prompts;
        }
        this.#prompts ??= await this.#api.rt(this.#rtId).workflow.getPrompts();
        return this.#prompts!;
    }

    /**
     * TreeView에 사용하는 프롬프트 트리 아이템 반환
    */
    async getPromptTree(refetch: boolean = false): Promise<Tree<string>> {
        const prompts = await this.#fetchPrompts(refetch);

        return prompts.map(({ id, name }) => node(name, id));
    }

    async relocatePromptTree() {

    }

    /**
     * 사용가능한 새 프롬프트 ID 생성
     */
    async generateNewPromptId() {
        const prompts = await this.#fetchPrompts();

        const [promptId] = genUntil(
            (i) => `prompt-${i}`,
            (promptId, i) => prompts.every(({ id }) => id !== promptId)
        )
        return promptId;
    }

    /**
     * 새 프롬프트 생성 및 프롬프트 목록 refetch
     * @param promptId 
     * @param promptName 
     */
    async createPrompt(promptId: string, promptName: string) {
        await this.#api.rt(this.#rtId).workflow.addPrompt(promptId, promptName);
        await this.#fetchPrompts(true);
    }
}