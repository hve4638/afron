import { FlowEdge, FlowNode } from '@/lib/xyflow';
import { RTFlowNodeData } from '@afron/types';

export declare namespace TransactionAction {
    type MoveNode = {
        type: 'move-node';
        nodeId: string;
        from: { x: number; y: number };
        to: { x: number; y: number };
    }
    type UpdateData = {
        type: 'update-data';
        nodeId: string;
    }
    type AddNode = {
        type: 'add-node';
        node: FlowNode;
    }
    type DeleteNode = {
        type: 'delete-node';
        node: FlowNode;
        data: RTFlowNodeData;
        connectedEdges: FlowEdge[];  // 노드 삭제 시 함께 삭제되는 엣지들
    }
    type ConnectNode = {
        type: 'connect-node';
        edgeId: string;
        source: string;
        target: string;
        sourceHandle: string;
        targetHandle: string;
    }
    type DisconnectNode = {
        type: 'disconnect-node';
        edgeId: string;
        source: string;
        target: string;
        sourceHandle: string;
        targetHandle: string;
    }
}
export type TransactionAction = (
    TransactionAction.MoveNode
    | TransactionAction.UpdateData
    | TransactionAction.AddNode
    | TransactionAction.DeleteNode
    | TransactionAction.ConnectNode
    | TransactionAction.DisconnectNode
);