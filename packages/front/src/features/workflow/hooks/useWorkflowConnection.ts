import { useCallback } from 'react';
import {
    addEdge,
    IsValidConnection,
    type OnConnect,
    type Connection,
} from '@xyflow/react';
import { FlowEdge } from '@/lib/xyflow';

import { isHandleCompatible } from '../components/nodes';
import { UseWorkflowHandlersProps } from '../types';

export function useWorkflowConnection({
    transaction,
    
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
}: UseWorkflowHandlersProps) {
    const onConnect: OnConnect = useCallback(
        (connection) => {
            setEdges((prev) => {
                const next = addEdge(connection, prev);

                const addedEdge = next[next.length - 1];
                if (addedEdge && connection.source && connection.target) {
                    transaction.callbacks.onEdgeConnect(
                        addedEdge.id,
                        connection.source,
                        connection.target,
                        connection.sourceHandle ?? '',
                        connection.targetHandle ?? ''
                    );
                }
                return next;
            });
        },
        [setEdges, nodes, transaction],
    );

    const isValidConnection = useCallback(
        (connection: Connection) => {
            const { sourceHandle, targetHandle } = connection;
            if (
                !sourceHandle
                || !targetHandle
                || connection.source === connection.target
            ) return false;

            const sourceNode = nodes.find((n) => n.id === connection.source);
            const targetNode = nodes.find((n) => n.id === connection.target);
            if (!sourceNode || !targetNode) return false;

            const sourceHandleType = sourceNode.data['outputTypes']![sourceHandle];
            const targetHandleType = targetNode.data['inputTypes']![targetHandle];

            if (!sourceHandleType || !targetHandleType) return false;

            return isHandleCompatible(sourceHandleType, targetHandleType);
        },
        [nodes],
    ) as IsValidConnection<FlowEdge>;

    return {
        onConnect,
        isValidConnection,
    }
}
