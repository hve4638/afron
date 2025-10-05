import { FlowNodeIf, FlowNodePosition } from './types';

interface IProfileRT {
    getNodes(): Promise<Record<string, StorageStruct.RT.FlowNode>>;
    addNode(type: FlowNodeType, position?: FlowNodePosition): Promise<string>
    removeNode(nodeId: string): Promise<void>;
    updateNodeData(nodeId: string, data: Record<string, any>): Promise<boolean>;
    updateNodePosition(nodeId: string, position: FlowNodePosition): Promise<boolean>;
    connectNode(from: FlowNodeIf, to: FlowNodeIf): Promise<boolean>;
    disconnectNode(from: FlowNodeIf, to: FlowNodeIf): Promise<boolean>;

    getMetadata(): Promise<Record<string, any>>;
    setMetadata(input: KeyValueInput): Promise<void>;

    getPromptContents(promptId: string): Promise<string>;
    setPromptContents(promptId: string, contents: string): Promise<void>;
    getPromptVariables(promptId: string): Promise<PromptVar[]>;
    setPromptVariables(promptId: string, vars: PromptVar[]): Promise<string[]>;
    removePromptVariables(promptId: string, varName: string[]): Promise<void>;
}

export default IProfileRT;