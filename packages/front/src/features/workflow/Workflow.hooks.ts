import { useCallback, useMemo } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    BackgroundVariant,
    type OnConnect,
    Handle,
    Position,
    type NodeProps,
    type Connection,
    NodeTypes,
    type Node as FlowNode,
    type Edge as FlowEdge,
    IsValidConnection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { HandleTypes, HandleColors } from './nodes/types';

export function useWorkflow({
    initialNodes,
    initialEdges
}: { initialNodes: FlowNode[], initialEdges: FlowEdge[] }) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect: OnConnect = useCallback(
        (params) => {
            const sourceNode = nodes.find(n => n.id === params.source);
            const sourceHandle = params.sourceHandle;

            let edgeColor = '#555';
            if (sourceNode && sourceHandle) {
                const handleType = HandleTypes[sourceHandle as keyof typeof HandleTypes];
                if (handleType) {
                    edgeColor = HandleColors[handleType];
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
            if (connection.source === connection.target) return false;

            const sourceNode = nodes.find((n) => n.id === connection.source);
            const targetNode = nodes.find((n) => n.id === connection.target);

            if (!sourceNode || !targetNode) return false;

            const sourceHandle = connection.sourceHandle;
            const targetHandle = connection.targetHandle;

            if (!sourceHandle || !targetHandle) return false;

            const sourceType = HandleTypes[sourceHandle];
            const targetType = HandleTypes[targetHandle];

            return sourceType === targetType;
        },
        [nodes],
    ) as IsValidConnection<FlowEdge>;

    return {
        nodes, onNodesChange,
        edges, onEdgesChange,
        onConnect,
        isValidConnection,
    }
}