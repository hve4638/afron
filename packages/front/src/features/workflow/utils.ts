import { FlowNode } from '@/lib/xyflow';
import { WorkflowNodeTypes } from './nodes';

export function buildNode(
    id: string,
    position: { x: number; y: number },
    nodeType: keyof typeof WorkflowNodeTypes
): FlowNode {
    const node = WorkflowNodeTypes[nodeType]
    return {
        id,
        position,
        type: node.nodeType,
        data: node.data,
    }
}