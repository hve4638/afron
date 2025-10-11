import {
    ConnectionLineComponentProps, getBezierPath, Handle, InternalNode, Position,
} from '@xyflow/react';
import { WorkflowNodeTypes } from './nodes';
import { HandleColors } from './nodes/types';
import { useMemo } from 'react';
import { FlowNode } from '@/lib/xyflow';

export function ConnectionLine({
    fromX,
    fromY,
    toX,
    toY,
    fromNode,
    fromHandle,
}: ConnectionLineComponentProps) {
    const [edgePath] = useMemo(() => getBezierPath({
        sourceX: fromX,
        sourceY: fromY,
        sourcePosition: Position.Right,
        targetX: toX,
        targetY: toY,
        targetPosition: Position.Left,
    }), [fromX, fromY, toX, toY]);
    const stroke = useMemo(() => getColor(fromNode, fromHandle), [fromNode, fromHandle]);

    return (
        <g>
            <path
                fill='none'
                stroke={stroke}
                strokeWidth={2}
                d={edgePath}
            />
        </g>
    );
}

function getColor(node: InternalNode<FlowNode>, handle: Handle) {
    if (node && handle) {
        const nodeType = node.type;
        const handleType = handle.type;

        if (!nodeType) {
            // do nothing
        }
        else if (handleType === 'source') {
            const data = WorkflowNodeTypes[nodeType]?.data;
            if (data?.outputTypes) {
                const handleType = data.outputTypes[handle.id];
                if (handleType) {
                    return HandleColors[handleType].value;
                }
            }
        }
        else if (handleType === 'target') {
            const data = WorkflowNodeTypes[nodeType]?.data;
            if (data?.inputTypes) {
                const handleType = data.inputTypes[handle.id];
                if (handleType) {
                    return HandleColors[handleType].value;
                }
            }
        }
    }

    return '#555';
}