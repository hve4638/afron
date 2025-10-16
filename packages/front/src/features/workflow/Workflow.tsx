import { createContext, Ref, RefObject, SetStateAction, useCallback, useMemo, useState } from 'react';
import {
    ReactFlow,
    ReactFlowProvider,
    MiniMap,
    Controls,
    Background,
    BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { WorkflowNodeTypes } from './nodes';
import { useWorkflow } from './Workflow.hooks';
import { ConnectionLine } from './ConnectionLine';
import { NodeOptionPanel } from './NodeOptionPanel';
import { FlowEdge, FlowNode } from '@/lib/xyflow';
import { WorkflowContext, WorkflowContextProvider } from './context';
import { NodeLibrary } from './SidePanel/NodeLibrary';
import styles from './Workflow.module.scss';
import { ChangeRTFlowDataAction, RemoveRTFlowDataAction } from './types';
import { Grid } from '@/components/layout';
import { SidePanel, WorkflowConfig } from './SidePanel';
import { SidePanelSections } from './SidePanel/types';
import { RTFlowData } from '@afron/types';

function WorkflowInner({
    children,
}: { children?: React.ReactNode }) {
    const {
        nodes,
        edges,
        lastSelectedNode, setLastSelectedNode,
        callback: workflowCallback,
    } = useWorkflow();

    const [sideSelected, setSideSelected] = useState<SidePanelSections | null>(null);

    const closeSidebar = useCallback(() => setLastSelectedNode(null), [setLastSelectedNode]);

    const onInit = useCallback((reactFlowInstance: any) => {
        const container = document.querySelector(`.${styles['workflow']}`);

        if (container) {
            const { clientWidth, clientHeight } = container;

            reactFlowInstance.setViewport({
                x: clientWidth / 2,
                y: clientHeight / 2,
                zoom: 1,
            });
        }
    }, []);

    return (
        <Grid
            rows='auto'
            columns='40px auto'
        >
            <SidePanel
                value={sideSelected}
                onChange={setSideSelected}
            />
            <ReactFlow
                className={styles['workflow']}
                nodes={nodes}
                edges={edges}
                onNodesChange={workflowCallback.onNodesChange}
                onEdgesChange={workflowCallback.onEdgesChange}
                onConnect={workflowCallback.onConnect}
                onInit={onInit}
                nodeTypes={WorkflowNodeTypes}
                deleteKeyCode='Delete'
                edgesReconnectable={true}
                isValidConnection={workflowCallback.isValidConnection}
                connectionLineComponent={ConnectionLine}
                onDragOver={workflowCallback.onDragOver}
                onDrop={workflowCallback.onDrop}
                onBeforeDelete={workflowCallback.onBeforeDelete}
                proOptions={{ hideAttribution: true }}
                defaultEdgeOptions={{
                    style: { strokeWidth: 2 }
                }}
            >
                {children}
                {
                    sideSelected === SidePanelSections.File &&
                    <WorkflowConfig/>
                }
                {
                    sideSelected === SidePanelSections.NodeLibrary &&
                    <NodeLibrary />
                }
                {
                    lastSelectedNode != null &&
                    <NodeOptionPanel
                        node={lastSelectedNode}
                        onClose={closeSidebar}
                    />
                }
                <MiniMap
                    style={{
                        backgroundColor: '#1f1f1f',
                        right: '350px'
                    }}
                    maskColor='rgba(0, 0, 0, 0.6)'
                    nodeColor='#333333'
                    nodeStrokeColor='#555555'
                />
                <Background
                    className={styles['background']}
                    variant={BackgroundVariant.Dots}
                    gap={32}
                    size={2}
                    color='#131313'
                />
            </ReactFlow>
        </Grid>
    )
}

export interface WorkflowProps {
    nodes: FlowNode[];
    edges: FlowEdge[];
    data: RTFlowData;
    onNodesChange: (changes: SetStateAction<FlowNode[]>) => void;
    onEdgesChange: (changes: SetStateAction<FlowEdge[]>) => void;
    onDataChange: (data: SetStateAction<RTFlowData>) => void;

    children?: React.ReactNode;
}

export function Workflow({
    nodes,
    edges,
    data,
    onNodesChange,
    onEdgesChange,
    onDataChange,

    children,
}: WorkflowProps) {

    return (
        <ReactFlowProvider>
            <WorkflowContextProvider
                nodes={nodes}
                edges={edges}
                data={data}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onDataChange={onDataChange}
            >
                <WorkflowInner>
                    {children}
                </WorkflowInner>
            </WorkflowContextProvider>
        </ReactFlowProvider>
    );
}