import { FlowEdge, FlowNode } from '@/lib/xyflow';
import { HandleColor, WorkflowNodeNames, WorkflowNodes } from './components/nodes';
import { HandleColors } from './components/nodes';
import { DRAG_NODE_TYPE } from './constants';

/**
 * 빈 Node 생성 유틸
 */
export function buildNode(
    id: string,
    position: { x: number; y: number },
    nodeType: keyof typeof WorkflowNodes
): FlowNode {
    const node = WorkflowNodes[nodeType];

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

    const data = WorkflowNodes[sourceNode.data['type'] as any].data;
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
export function getNodeIdFromDropEvent(event: React.DragEvent): WorkflowNodeNames | null {
    const nodeId = event.dataTransfer.getData(DRAG_NODE_TYPE);
    if (!nodeId || !WorkflowNodes[nodeId]) return null;

    return nodeId as WorkflowNodeNames;
}