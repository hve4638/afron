import { useCallback } from 'react';
import { useReactFlow, } from '@xyflow/react';
import { buildNode, getNodeIdFromDropEvent } from '../utils';
import { useWorkflowContext } from '../context';
import { UseWorkflowHandlersProps } from '../types';

export function useWorkflowDragDrop({
    transaction,
    setNodes,
}: UseWorkflowHandlersProps) {
    const reactFlowInstance = useReactFlow();
    const { setNodeData } = useWorkflowContext();

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback((event: React.DragEvent) => {
        event.preventDefault();

        const nodeId = getNodeIdFromDropEvent(event);
        if (!nodeId) return;

        const position = reactFlowInstance.screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });

        // @TODO: date 기반이 아니라 겹치지 않는 index 기반으로 변경
        const newNodeId = `${nodeId}-${Date.now()}`;
        const next = buildNode(newNodeId, position, nodeId);

        setNodeData(next.id, {
            connection: [],
            description: '',
            data: {},
            type: nodeId,
            position: next.position,
        });
        setNodes((prev) => prev.concat(next));

        transaction.callbacks.onNodeAdd(next);
    }, [reactFlowInstance, setNodes, transaction]);

    return {
        onDragOver,
        onDrop,
    }
}