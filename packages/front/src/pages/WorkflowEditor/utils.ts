import { FlowEdge, FlowNode } from '@/lib/xyflow';
import { buildNode } from '@/features/workflow';
import { RTFlowData } from '@afron/types';

/**
 * Convert RTFlowData to FlowNode and FlowEdge arrays
 */
export function convertFlowDataToWorkflow(
    flowData: RTFlowData
): { nodes: FlowNode[]; edges: FlowEdge[] } {
    const nodes: FlowNode[] = [];
    const edges: FlowEdge[] = [];
    let edgeId = 0;

    for (const [id, nodeData] of Object.entries(flowData)) {
        // Create FlowNode from RTFlowNodeData
        nodes.push(
            buildNode(id, nodeData.position, nodeData.type)
        );

        // Create FlowEdge from connections
        for (const { from_handle, to_node, to_handle } of nodeData.connection) {
            edges.push({
                id: `edge-${edgeId++}`,
                source: id,
                sourceHandle: from_handle,
                target: to_node,
                targetHandle: to_handle,
            });
        }
    }

    return { nodes, edges };
}

/**
 * Synchronize both FlowNode and FlowEdge to RTFlowData
 */
export function applyWorkflowData(
    data: RTFlowData,
    nodes: FlowNode[],
    edges: FlowEdge[]
): RTFlowData {
    let updatedData = applyPositionToFlowData(data, nodes);
    updatedData = applyConnnectionsToFlowData(updatedData, edges);
    return updatedData;
}

export function applyConnnectionsToFlowData(data: RTFlowData, edges: FlowEdge[]): RTFlowData {
    // Initialize all node connections
    const updatedData = { ...data };
    for (const nodeId in updatedData) {
        updatedData[nodeId] = {
            ...updatedData[nodeId],
            connection: [],
        };
    }

    // Add edge information to each source node's connection
    for (const edge of edges) {
        const sourceNode = updatedData[edge.source];
        if (sourceNode) {
            sourceNode.connection.push({
                from_handle: edge.sourceHandle || '',
                to_node: edge.target,
                to_handle: edge.targetHandle || '',
            });
        }
    }

    return updatedData;
}


export function applyPositionToFlowData(data: RTFlowData, nodes: FlowNode[]): RTFlowData {
    const updatedData = { ...data };

    for (const node of nodes) {
        if (updatedData[node.id]) {
            updatedData[node.id] = {
                ...updatedData[node.id],
                position: node.position,
            };
        }
    }

    return updatedData;
}
