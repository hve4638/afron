import { useContextForce } from '@/context';
import { createContext, SetStateAction, useCallback } from 'react';
import { FlowEdge, FlowNode } from '@/lib/xyflow';
import { RTFlowData, RTFlowNodeData } from '@afron/types';

export interface WorkflowState {
    initialStates: {
        nodes: FlowNode[];
        edges: FlowEdge[];
        data: RTFlowData;
    }

    handles: {
        onNodesChange: (changes: SetStateAction<FlowNode[]>) => void;
        onEdgesChange: (changes: SetStateAction<FlowEdge[]>) => void;
        onDataChange: (data: RTFlowData) => void;
    }

    actions: {
        /** nodeId에서 NodeData 리턴 */
        getNodeData: <TData = Record<string, unknown>>(nodeId: string) => RTFlowNodeData<TData>;
        /** nodeId에 해당하는 NodeData 변경 */
        setNodeData: (nodeId: string, data: SetStateAction<RTFlowNodeData>) => void;
        /** nodeId에 해당하는 NodeData 제거 */
        removeNodeData: (nodeId: string) => void;
        save: () => void;
    }


    nodes: FlowNode[];
    edges: FlowEdge[];
    data: RTFlowData;
    onNodesChange: (changes: SetStateAction<FlowNode[]>) => void;
    onEdgesChange: (changes: SetStateAction<FlowEdge[]>) => void;
    onDataChange: (data: RTFlowData) => void;

    /** nodeId에서 NodeData 리턴 */
    getNodeData: <TData = Record<string, unknown>>(nodeId: string) => RTFlowNodeData<TData>;
    /** nodeId에 해당하는 NodeData 변경 */
    setNodeData: (nodeId: string, data: SetStateAction<RTFlowNodeData>) => void;
    /** nodeId에 해당하는 NodeData 제거 */
    removeNodeData: (nodeId: string) => void;
}

export const WorkflowContext = createContext<WorkflowState | null>(null);
