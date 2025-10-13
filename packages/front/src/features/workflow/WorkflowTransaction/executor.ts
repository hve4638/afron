import { SetStateAction } from 'react';
import { TransactionAction } from './types';
import { FlowEdge, FlowNode } from '@/lib/xyflow';
import { FlowNodeType, RTFlowNodeData } from '@afron/types';

/**
 * Transaction 실행에 필요한 콜백 인터페이스
 */
export interface TransactionExecutorCallbacks {
    setNodes: React.Dispatch<React.SetStateAction<FlowNode[]>>;
    setEdges: React.Dispatch<React.SetStateAction<FlowEdge[]>>;
    setNodeData: (nodeId: string, data: SetStateAction<RTFlowNodeData>) => void;
    removeNodeData: (nodeId: string) => void;
}

/**
 * Transaction Executor 클래스
 * 각 TransactionAction을 실제로 실행하는 로직을 담당
 */
export class TransactionExecutor {
    constructor(private callbacks: TransactionExecutorCallbacks) {}

    // ===== Move Node =====
    undoMoveNode(action: TransactionAction.MoveNode) {
        this.callbacks.setNodes((nodes) =>
            nodes.map((node) =>
                node.id === action.nodeId
                    ? { ...node, position: action.from }
                    : node
            )
        );
    }

    redoMoveNode(action: TransactionAction.MoveNode) {
        this.callbacks.setNodes((nodes) =>
            nodes.map((node) =>
                node.id === action.nodeId
                    ? { ...node, position: action.to }
                    : node
            )
        );
    }

    // ===== Add Node =====
    undoAddNode(action: TransactionAction.AddNode) {
        this.callbacks.setNodes((nodes) => nodes.filter((n) => n.id !== action.node.id));
        this.callbacks.removeNodeData(action.node.id);
    }

    redoAddNode(action: TransactionAction.AddNode) {
        this.callbacks.setNodes((nodes) => [...nodes, action.node]);
        this.callbacks.setNodeData(action.node.id, {
            connection: [],
            description: '',
            data: {},
            type: action.node.type as FlowNodeType,
            position: action.node.position,
        });
    }

    // ===== Delete Node =====
    undoDeleteNode(action: TransactionAction.DeleteNode) {
        // 1. 노드 복원
        this.callbacks.setNodes((nodes) => [...nodes, action.node]);

        // 2. 노드 데이터 복원
        this.callbacks.setNodeData(action.node.id, action.data);

        // 3. 연결된 엣지들 복원
        this.callbacks.setEdges((edges) => [...edges, ...action.connectedEdges]);
    }

    redoDeleteNode(action: TransactionAction.DeleteNode) {
        // 1. 연결된 엣지들 제거
        const edgeIdsToRemove = new Set(action.connectedEdges.map(e => e.id));
        this.callbacks.setEdges((edges) => edges.filter(e => !edgeIdsToRemove.has(e.id)));

        // 2. 노드 제거
        this.callbacks.setNodes((nodes) => nodes.filter((n) => n.id !== action.node.id));

        // 3. 노드 데이터 제거
        this.callbacks.removeNodeData(action.node.id);
    }

    // ===== Connect Node =====
    undoConnectNode(action: TransactionAction.ConnectNode) {
        this.callbacks.setEdges((edges) => edges.filter((e) => e.id !== action.edgeId));
    }

    redoConnectNode(action: TransactionAction.ConnectNode) {
        const newEdge: FlowEdge = {
            id: action.edgeId,
            source: action.source,
            target: action.target,
            sourceHandle: action.sourceHandle,
            targetHandle: action.targetHandle,
        };
        this.callbacks.setEdges((edges) => [...edges, newEdge]);
    }

    // ===== Disconnect Node =====
    undoDisconnectNode(action: TransactionAction.DisconnectNode) {
        const restoredEdge: FlowEdge = {
            id: action.edgeId,
            source: action.source,
            target: action.target,
            sourceHandle: action.sourceHandle,
            targetHandle: action.targetHandle,
        };
        this.callbacks.setEdges((edges) => [...edges, restoredEdge]);
    }

    redoDisconnectNode(action: TransactionAction.DisconnectNode) {
        this.callbacks.setEdges((edges) => edges.filter((e) => e.id !== action.edgeId));
    }

    // ===== Update Data =====
    undoUpdateData(action: TransactionAction.UpdateData) {
        // TODO: action에 before/after 데이터가 추가되어야 구현 가능
        console.warn('UpdateData undo not implemented yet - requires before/after data');
    }

    redoUpdateData(action: TransactionAction.UpdateData) {
        // TODO: action에 before/after 데이터가 추가되어야 구현 가능
        console.warn('UpdateData redo not implemented yet - requires before/after data');
    }

    // ===== Main Executors =====
    executeUndo(action: TransactionAction): void {
        switch (action.type) {
            case 'move-node':
                this.undoMoveNode(action);
                break;
            case 'add-node':
                this.undoAddNode(action);
                break;
            case 'delete-node':
                this.undoDeleteNode(action);
                break;
            case 'connect-node':
                this.undoConnectNode(action);
                break;
            case 'disconnect-node':
                this.undoDisconnectNode(action);
                break;
            case 'update-data':
                this.undoUpdateData(action);
                break;
        }
    }

    executeRedo(action: TransactionAction): void {
        switch (action.type) {
            case 'move-node':
                this.redoMoveNode(action);
                break;
            case 'add-node':
                this.redoAddNode(action);
                break;
            case 'delete-node':
                this.redoDeleteNode(action);
                break;
            case 'connect-node':
                this.redoConnectNode(action);
                break;
            case 'disconnect-node':
                this.redoDisconnectNode(action);
                break;
            case 'update-data':
                this.redoUpdateData(action);
                break;
        }
    }
}
