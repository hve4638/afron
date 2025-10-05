import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import {
    useNodesState,
    useEdgesState,
    addEdge,
    type OnConnect,
    type Connection,
    IsValidConnection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { HandleTypes, HandleColors } from './nodes/types';
import { isHandleCompatible, WorkflowNodeTypes } from './nodes';
import { FlowEdge, FlowNode } from '@/lib/xyflow';

export function useWorkflow({
    initialNodes,
    initialEdges
}: { initialNodes: FlowNode[], initialEdges: FlowEdge[] }) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const [lastSelectedNode, setLastSelectedNode] = useState<FlowNode | null>(null);

    const coloredEdges = useMemo(() => {
        return edges.map(edge => {
            const sourceNode = nodes.find(n => n.id === edge.source);
            if (!sourceNode || !edge.sourceHandle) return edge;

            const data = WorkflowNodeTypes[sourceNode.type!].data;
            const handleType = data.outputTypes[edge.sourceHandle];
            const color = HandleColors[handleType] ?? {
                value: '#555555',
                selected: '#222222',
            };

            return {
                ...edge,
                style: {
                    ...edge.style,
                    stroke: edge.selected ? color.selected : color.value,
                    strokeWidth: 2
                }
            };
        });
    }, [edges, nodes]);

    const onConnect: OnConnect = useCallback(
        (params) => {
            const sourceNode = nodes.find(n => n.id === params.source);
            const sourceHandle = params.sourceHandle;

            let edgeColor = '#555';
            if (sourceNode && sourceHandle) {
                const handleType = HandleTypes[sourceHandle as keyof typeof HandleTypes];
                if (handleType) {
                    edgeColor = HandleColors[handleType].value;
                }
            }

            const newEdge = {
                ...params,
                style: { stroke: edgeColor, strokeWidth: 2 }
            };

            setEdges((eds) => addEdge(newEdge, eds));
        },
        [setEdges, nodes],
    );

    const isValidConnection = useCallback(
        (connection: Connection) => {
            const {
                sourceHandle,
                targetHandle
            } = connection;

            if (connection.source === connection.target) return false;
            const sourceNode = nodes.find((n) => n.id === connection.source);
            const targetNode = nodes.find((n) => n.id === connection.target);

            if (
                !sourceNode
                || !targetNode
                || !sourceHandle
                || !targetHandle
            ) {
                return false;
            }

            const sourceHandleType = sourceNode.data['outputTypes']![sourceHandle];
            const targetHandleType = targetNode.data['inputTypes']![targetHandle];

            if (!sourceHandleType || !targetHandleType) return false;
            if (sourceHandleType === targetHandleType) return true;

            return isHandleCompatible(sourceHandleType, targetHandleType);
        },
        [nodes],
    ) as IsValidConnection<FlowEdge>;

    useLayoutEffect(() => {
        const selectedNode = nodes.find(n => n.selected);

        if (
            selectedNode != null
            && (
                lastSelectedNode == null
                || selectedNode.id !== lastSelectedNode.id
            )
        ) {
            setLastSelectedNode(selectedNode);
        }
    }, [nodes]);

    return {
        nodes, onNodesChange,
        edges: coloredEdges, onEdgesChange,
        lastSelectedNode, setLastSelectedNode,
        onConnect,
        isValidConnection,
    }
}