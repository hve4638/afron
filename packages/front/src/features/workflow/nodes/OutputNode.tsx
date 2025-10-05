import { NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { HandleTypes } from './types';
import { buildNodeData } from './utils';

export function OutputNode(props: NodeProps) {
    return (
        <BaseNode
            title='출력'
            {...props}
        >
        </BaseNode>
    )
}

OutputNode.nodeType = 'rt-output' as const;
OutputNode.data = buildNodeData(
    'Output',
    [
        ['output', HandleTypes.Output],
    ],
    [
    ]
);