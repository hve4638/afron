import { FlowEdge, FlowNode } from '@/lib/xyflow';
import { HandleColor, WorkflowNodeTypeNames, WorkflowNodeTypes } from './nodes';
import { HandleColors } from './nodes';
import { DRAG_NODE_TYPE } from './constants';

/**
 * 빈 Node 생성 유틸
 */
export function buildNode(
    id: string,
    position: { x: number; y: number },
    nodeType: keyof typeof WorkflowNodeTypes
): FlowNode {
    const node = WorkflowNodeTypes[nodeType];

    return {
        id,
        position,
        type: node.data.type,
        data: {
            label: node.data.alias[0] ?? node.data.type,
            ...node.data,
        },
    }
}


/**
 * 노드의 edge간 연결 선 색상 객체 리턴
 * 
 * 미리 선언된 색상이 없다면 null 리턴
 * 
 * @param nodes 
 * @param edge 
 * @returns HandleColor
 */
export function findConnnectionLineColor(nodes: FlowNode[], edge: FlowEdge): HandleColor | null {
    const sourceNode = nodes.find(n => n.id === edge.source);
    if (!sourceNode || !edge.sourceHandle) return null;

    const data = WorkflowNodeTypes[sourceNode.data['type'] as any].data;
    console.log('data', data, edge.sourceHandle); 
    const handleType = data.outputTypes[edge.sourceHandle];
    return HandleColors[handleType] ?? null;
}

/**
 * 드래그 이벤트에서 노드 ID 가져오기, 유효하지 않은 경우 null 리턴
 * 
 * @param event 
 * @returns 
 */
export function getNodeIdFromDropEvent(event: React.DragEvent): WorkflowNodeTypeNames | null {
    const nodeId = event.dataTransfer.getData(DRAG_NODE_TYPE);
    if (!nodeId || !WorkflowNodeTypes[nodeId]) return null;

    return nodeId as WorkflowNodeTypeNames;
}