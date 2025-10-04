import { NodeProps } from '@xyflow/react';
import { BaseNode } from './base';
import { HandleTypes } from './types';
import { buildNodeData } from './utils';

export function OutputNode(props: NodeProps) {
    return (
        <BaseNode
            {...props}
        >
        </BaseNode>
    )
}

OutputNode.nodeType = 'rt-output';
OutputNode.data = buildNodeData(
    'Output',
    [
        ['output', HandleTypes.Output],
    ],
    [
    ]
);