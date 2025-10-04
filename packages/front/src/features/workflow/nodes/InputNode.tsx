import { NodeProps } from '@xyflow/react';
import { BaseNode } from './base';
import { HandleTypes } from './types';
import { buildNodeData } from './utils';

export function InputNode(props: NodeProps) {
    return (
        <BaseNode
            {...props}
        >
        </BaseNode>
    )
}

InputNode.nodeType = 'rt-input';
InputNode.data = buildNodeData(
    'Input',
    [],
    [
        ['input', HandleTypes.Input],
    ]
);