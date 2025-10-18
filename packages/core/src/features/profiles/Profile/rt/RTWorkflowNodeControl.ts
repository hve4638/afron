import { IACSubStorage } from 'ac-storage';
import { FlowNodeIf, FlowNodePosition } from './types';
import { FlowNodeType, KeyValueInput, RTFlowData, RTForm, RTIndex, RTPromptDataEditable, RTPromptMetadata, StorageStruct } from '@afron/types';

/**
 * 워크플로우 노드 고수준 제어 클래스
 * 
 * backend에서 직접 노드 제어 시 사용
 * 
 * 템플릿 생성 및 이전 버전 호환성 처리 단계에서만 사용해야 함
 */
export class RTWorkflowNodeControl {
    constructor(private storage: IACSubStorage, private rtId: string) {

    }

    private async accessFlow() {
        return await this.storage.accessAsJSON(`${this.rtId}:flow.json`);
    }

    async addNode(type: FlowNodeType, position: FlowNodePosition = { x: 0, y: 0 }): Promise<string> {
        const flowAC = await this.accessFlow();
        const nodes: Record<string, StorageStruct.RT.FlowNode> = flowAC.getAll() ?? {};

        let index = 0;
        let nodeId = `${type}-${index}`;
        while (nodeId in nodes) {
            index++;
        }

        const newNode: StorageStruct.RT.FlowNode = {
            type: type,
            description: '',
            connection: [],
            data: {},
            position,
        }

        try {
            flowAC.set({ [nodeId]: newNode });

            return nodeId;
        }
        catch (e) {
            console.error("Failed to add node:", e);

            return '';
        }
    }
    async removeNode(nodeId: string): Promise<void> {
        const flowAC = await this.accessFlow();

        flowAC.removeOne(nodeId);
    }
    async updateNodeData(nodeId: string, data: Record<string, any>): Promise<boolean> {
        const flowAC = await this.accessFlow();
        const node = flowAC.getOne(nodeId);
        if (!node) return false;

        flowAC.set({
            [nodeId]: { data }
        });
        return true;
    }
    async updateNodePosition(nodeId: string, position: FlowNodePosition): Promise<boolean> {
        const flowAC = await this.accessFlow();
        const node = flowAC.getOne(nodeId);
        if (!node) return false;

        flowAC.set({
            [nodeId]: { position }
        });
        return true;
    }

    async connectNode(from: FlowNodeIf, to: FlowNodeIf): Promise<boolean> {
        const flowAC = await this.accessFlow();
        const node: StorageStruct.RT.FlowNode | null = flowAC.getOne(from.node);

        if (!node) return false;

        node.connection.push({
            from_handle: from.ifName,
            to_node: to.node,
            to_handle: to.ifName,
        });
        flowAC.set({
            [from.node]: { connection: node.connection }
        });

        return true;
    }
    async disconnectNode(from: FlowNodeIf, to: FlowNodeIf): Promise<boolean> {
        const flowAC = await this.accessFlow();

        const fromNode: StorageStruct.RT.FlowNode = flowAC.getOne(from.node);
        if (!fromNode) return false;

        const next = fromNode.connection.filter(
            ({ from_handle, to_node, to_handle }) => {
                return !(
                    from_handle === from.ifName &&
                    to_node === to.node &&
                    to_handle === to.ifName
                );
            }
        );

        flowAC.set({
            [from.node]: { connection: next }
        });
        return true;
    }
}