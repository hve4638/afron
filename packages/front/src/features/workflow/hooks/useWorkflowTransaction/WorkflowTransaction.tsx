import { useCallback, useEffect, useMemo, useState } from 'react';
import { TransactionAction } from './types';
import { FlowNode, FlowEdge } from '@/lib/xyflow';
import { TransactionExecutor, TransactionExecutorCallbacks } from './executor';
import { useWorkflowContext } from '../../context';
import { RTFlowNodeData } from '@afron/types';

const MAX_HISTORY_SIZE = 50;

interface UseWorkflowTransactionProps {
    setNodes: React.Dispatch<React.SetStateAction<FlowNode[]>>;
    setEdges: React.Dispatch<React.SetStateAction<FlowEdge[]>>;
}

export function useWorkflowTransaction({
    setNodes,
    setEdges,
}: UseWorkflowTransactionProps) {
    const {
        setNodeData,
        removeNodeData,
    } = useWorkflowContext();
    const [undoStack, setUndoStack] = useState<TransactionAction[]>([]);
    const [redoStack, setRedoStack] = useState<TransactionAction[]>([]);
    const [isProgrammatic, setIsProgrammatic] = useState(false);

    // Executor 인스턴스 생성 (메모이제이션)
    const executor = useMemo(() => {
        return new TransactionExecutor({
            setNodes,
            setEdges,
            setNodeData,
            removeNodeData,
        });
    }, [setNodes, setEdges, setNodeData, removeNodeData]);

    // 트랜잭션 기록
    const recordAction = useCallback((action: TransactionAction) => {
        if (isProgrammatic) return; // Undo/Redo 실행 중에는 기록하지 않음

        setUndoStack(prev => {
            const newStack = [...prev, action];
            // 히스토리 크기 제한
            if (newStack.length > MAX_HISTORY_SIZE) {
                return newStack.slice(1);
            }
            return newStack;
        });

        // 새로운 액션이 기록되면 redo 스택 초기화
        setRedoStack([]);
    }, [isProgrammatic]);

    // Undo - 스택에서 꺼내서 실행
    const undo = useCallback(() => {
        if (undoStack.length === 0) return;

        const action = undoStack[undoStack.length - 1];
        setUndoStack(prev => prev.slice(0, -1));
        setRedoStack(prev => [...prev, action]);

        // isProgrammatic 플래그 설정하고 실행
        setIsProgrammatic(true);
        try {
            executor.executeUndo(action);
        } finally {
            setIsProgrammatic(false);
        }
    }, [undoStack, executor]);

    // Redo - 스택에서 꺼내서 실행
    const redo = useCallback(() => {
        if (redoStack.length === 0) return;

        const action = redoStack[redoStack.length - 1];
        setRedoStack(prev => prev.slice(0, -1));
        setUndoStack(prev => [...prev, action]);

        // isProgrammatic 플래그 설정하고 실행
        setIsProgrammatic(true);
        try {
            executor.executeRedo(action);
        } finally {
            setIsProgrammatic(false);
        }
    }, [redoStack, executor]);

    // 히스토리 초기화
    const clearHistory = useCallback(() => {
        setUndoStack([]);
        setRedoStack([]);
    }, []);

    // 노드 이동 콜백
    const onNodeMove = useCallback((
        nodeId: string,
        from: { x: number; y: number },
        to: { x: number; y: number }
    ) => {
        recordAction({
            type: 'move-node',
            nodeId,
            from,
            to,
        });
    }, [recordAction]);

    // 노드 추가 콜백
    const onNodeAdd = useCallback((node: FlowNode) => {
        recordAction({
            type: 'add-node',
            node,
        });
    }, [recordAction]);

    // 노드 삭제 콜백
    const onNodeDelete = useCallback((node: FlowNode, data: RTFlowNodeData, connectedEdges: FlowEdge[]) => {
        recordAction({
            type: 'delete-node',
            node,
            data,
            connectedEdges,
        });
    }, [recordAction]);

    // 노드 데이터 수정 콜백
    const onNodeDataUpdate = useCallback((nodeId: string) => {
        recordAction({
            type: 'update-data',
            nodeId,
        });
    }, [recordAction]);

    // 엣지 연결 콜백
    const onEdgeConnect = useCallback((
        edgeId: string,
        source: string,
        target: string,
        sourceHandle: string,
        targetHandle: string
    ) => {
        recordAction({
            type: 'connect-node',
            edgeId,
            source,
            target,
            sourceHandle,
            targetHandle,
        });
    }, [recordAction]);

    // 엣지 연결 해제 콜백
    const onEdgeDisconnect = useCallback((
        edgeId: string,
        source: string,
        target: string,
        sourceHandle: string,
        targetHandle: string
    ) => {
        recordAction({
            type: 'disconnect-node',
            edgeId,
            source,
            target,
            sourceHandle,
            targetHandle,
        });
    }, [recordAction]);
    return {
        canUndo: undoStack.length > 0,
        canRedo: redoStack.length > 0,

        // Undo/Redo 실행 함수 (직접 호출 가능)
        undo,
        redo,
        clearHistory,

        // Transaction 기록 콜백
        callbacks: {
            onNodeMove,
            onNodeAdd,
            onNodeDelete,
            onNodeDataUpdate,
            onEdgeConnect,
            onEdgeDisconnect,
        },

        isProgrammatic,
        setProgrammatic: setIsProgrammatic,
    };
}