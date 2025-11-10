import { useCallback } from 'react';
import { useReactFlow, } from '@xyflow/react';
import { buildNode, getNodeIdFromDropEvent } from '../utils';
import { useWorkflowContext } from '../context';
import { UseWorkflowHandlersProps } from '../types';
import { WorkflowNodes } from '../components/nodes';

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

        const components = WorkflowNodes[nodeId];
        if (!components) {
            console.warn('Drag and drop failed. Invalid node ID:', nodeId);
            return;
        }

        setNodeData(next.id, {
            connection: [],
            description: '',
            data: components.data.defaultNodeData,
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