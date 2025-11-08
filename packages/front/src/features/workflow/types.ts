import { Dispatch, SetStateAction } from 'react';
import { OnEdgesChange, OnNodesChange } from '@xyflow/react';
import { FlowEdge, FlowNode } from '@/lib/xyflow';
import { RTFlowNodeData } from '@afron/types'
import { useWorkflowTransaction } from './hooks';


export type ChangeRTFlowDataAction = (nodeId: string, data: SetStateAction<RTFlowNodeData>) => void;
export type RemoveRTFlowDataAction = (nodeId: string) => void;

export interface UseWorkflowHandlersProps {
    transaction: ReturnType<typeof useWorkflowTransaction>;
    
    nodes: FlowNode[];
    setNodes: Dispatch<SetStateAction<FlowNode[]>>;
    onNodesChange: OnNodesChange<FlowNode>;

    edges: FlowEdge[];
    setEdges: Dispatch<SetStateAction<FlowEdge[]>>;
    onEdgesChange: OnEdgesChange<FlowEdge>;
}