import { buildNode } from '@/features/workflow';
import { FlowEdge, FlowNode } from '@/lib/xyflow';
import { useProfileAPIStore } from '@/stores';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';

export function useWorkflowEditor() {
    const { api } = useProfileAPIStore();
    const { rtId } = useParams();
    const [flowNode, setFlowNode] = useState<FlowNode[] | null>(null);
    const [flowEdges, setFlowEdges] = useState<FlowEdge[] | null>(null);
    const flowDataRef = useRef<RTFlowData>({});

    useEffect(() => {
        if (!rtId) return;

        let nodes: FlowNode[] = [];
        let edges: FlowEdge[] = [];
        let edgeId = 0;
        (
            async () => {
                const flowData = await api.workflow.getFlowData(rtId)

                for (const [id, node] of Object.entries(flowData)) {
                    nodes.push(
                        buildNode(id, node.position, node.type)
                    );

                    for (const { from_handle, to_node, to_handle } of node.connection) {
                        const edge = `edge-${edgeId++}`;
                        edges.push({
                            id: edge,
                            source: id,
                            sourceHandle: from_handle,
                            target: to_node,
                            targetHandle: to_handle,
                        });
                    }
                }

                setFlowNode(nodes);
                setFlowEdges(edges);
                flowDataRef.current = flowData;
            }
        )();
    }, []);

    return {
        nodes: flowNode,
        edges: flowEdges,
        dataRef: flowDataRef,
    };
}