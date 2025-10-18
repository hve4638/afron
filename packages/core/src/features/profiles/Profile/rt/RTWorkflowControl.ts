import { IACSubStorage } from 'ac-storage';
import { FlowNodeType, KeyValueInput, RTFlowData, RTForm, RTIndex, RTPromptDataEditable, RTPromptMetadata, ProfileStorage } from '@afron/types';
import { RTWorkflowNodeControl } from './RTWorkflowNodeControl';
import { matchesAll } from '@/utils/array-utils';


export class RTWorkflowControl {
    #nodeControl: RTWorkflowNodeControl;

    constructor(private storage: IACSubStorage, private rtId: string) {
        this.#nodeControl = new RTWorkflowNodeControl(storage, rtId);
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

    /**
     * 워크플로우 노드 전체 데이터 리턴
     */
    async getWorkflowNodes(): Promise<RTFlowData> {
        const flowAC = await this.accessFlow();
        const nodes: Record<string, ProfileStorage.RT.FlowNode> = flowAC.getAll() ?? {};
        return nodes;
    }

    /**
     * 워크플로우 노드 전체 데이터 설정
     */
    async setWorkflowNodes(data: RTFlowData): Promise<void> {
        const flowAC = await this.accessFlow();

        const keys = Object.keys(flowAC.getAll());
        flowAC.remove(keys);
        flowAC.set(data);
    }

    /** 워크플로우 내의 프롬프트 목록 리턴 */
    async getPrompts(): Promise<ProfileStorage.RT.PromptOrder> {
        const indexAC = await this.accessIndex();
        return indexAC.getOne('prompts') ?? [];
    }

    /**
     * 프롬프트 목록의 순서 변경
     * 
     * 순서 변경만 가능하며, 목록에 없는 항목을 추가하거나 제거할 수 없음
    */
    async setPromptsOrder(order: ProfileStorage.RT.PromptOrder): Promise<void> {
        const indexAC = await this.accessIndex();
        const prevOrder: ProfileStorage.RT.PromptOrder = indexAC.getOne('prompts') ?? [];

        if (!matchesAll(prevOrder, order, (a, b) => a.id === b.id)) {
            throw new Error("Invalid prompt order change");
        }

        indexAC.set({ prompts: order });
    }

    /**
     * 프롬프트 추가, default 프롬프트는 별로도 추가하지 않음
     */
    async addPrompt(promptId: string, name: string): Promise<void> {
        const indexAC = await this.accessIndex();
        const prev: ProfileStorage.RT.PromptOrder = indexAC.getOne('prompts') ?? [];

        if (promptId === 'default') {
            throw new Error('Cannot use reserved prompt ID');
        }

        indexAC.set({ prompts: [...prev, { id: promptId, name }] });
    }

    
    /** 프롬프트 제거 */
    async removePrompt(promptId: string): Promise<void> {
        const indexAC = await this.accessIndex();
        const prev: ProfileStorage.RT.PromptOrder = indexAC.getOne('prompts') ?? [];

        const next = prev.filter(p => p.id !== promptId);

        indexAC.set({ prompts: next });
    }

    get node() {
        return this.#nodeControl;
    }
}