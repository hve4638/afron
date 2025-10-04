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
    Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { WorkflowNodeTypes } from './nodes';
import { useWorkflow } from './Workflow.hooks';
import { buildNode } from './utils';
import { HandleColors, HandleTypes } from './nodes/types';

export function Workflow({
    nodes: initialNodes,
    edges: initialEdges
}: { nodes: ReturnType<typeof buildNode>[], edges: Edge[] }) {
    const {
        nodes, onNodesChange,
        edges, onEdgesChange,
        onConnect,
        isValidConnection,
    } = useWorkflow({
        initialNodes,
        initialEdges
    });

    const getEdgeColor = (edge: Edge) => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        if (!sourceNode) return '#555';

        const sourceHandle = edge.sourceHandle;
        if (!sourceHandle) return '#555';

        const handleType = HandleTypes[sourceHandle as keyof typeof HandleTypes];
        return handleType ? HandleColors[handleType] : '#555';
    };

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={WorkflowNodeTypes}
            deleteKeyCode="Delete"
            edgesReconnectable={true}
            isValidConnection={isValidConnection}
            defaultEdgeOptions={{
                style: { strokeWidth: 2 }
            }}
        >
            <Controls />
            <MiniMap
                style={{
                    backgroundColor: '#1f1f1f',
                }}
                maskColor="rgba(0, 0, 0, 0.6)"
                nodeColor="#333333"
                nodeStrokeColor="#555555"
            />
            <Background
                variant={BackgroundVariant.Dots}
                gap={32}
                size={2}
                color="#131313"
                style={{ backgroundColor: '#1f1f1f' }}
            />
        </ReactFlow>
    )
}