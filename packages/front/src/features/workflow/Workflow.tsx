import { useCallback, useMemo, useState } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { WorkflowNodeTypes } from './nodes';
import { useWorkflow } from './Workflow.hooks';
import { buildNode } from './utils';
import { ConnectionLine } from './ConnectionLine';
import { Sidebar } from './Sidebar';
import { FlowEdge } from '@/lib/xyflow';

export interface WorkflowProps {
    nodes: ReturnType<typeof buildNode>[];
    edges: FlowEdge[];
    children?: React.ReactNode;
}

export function Workflow({
    nodes: initialNodes,
    edges: initialEdges,
    children,
}: WorkflowProps) {
    const {
        nodes, onNodesChange,
        edges, onEdgesChange,
        lastSelectedNode, setLastSelectedNode,
        onConnect,
        isValidConnection,
    } = useWorkflow({
        initialNodes,
        initialEdges
    });

    const closeSidebar = useCallback(() => setLastSelectedNode(null), [setLastSelectedNode]);

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={WorkflowNodeTypes}
            deleteKeyCode='Delete'
            edgesReconnectable={true}
            isValidConnection={isValidConnection}
            connectionLineComponent={ConnectionLine}
            proOptions={{ hideAttribution: true }}
            defaultEdgeOptions={{
                style: { strokeWidth: 2 }
            }}
        >
            {children}
            {
                lastSelectedNode != null &&
                <Sidebar
                    node={lastSelectedNode}
                    onClose={closeSidebar}
                />
            }
            <MiniMap
                style={{
                    backgroundColor: '#1f1f1f',
                    right: '350px'
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