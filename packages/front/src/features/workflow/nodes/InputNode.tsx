import { NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { HandleTypes } from './types';
import { buildNodeData } from './utils';

export function InputNode(props: NodeProps) {
    return (
        <BaseNode
            title='입력'
            {...props}
        >
        </BaseNode>
    )
}

InputNode.nodeType = 'rt-input' as const;
InputNode.data = buildNodeData(
    'Input',
    [],
    [
        ['input', HandleTypes.Input],
    ]
);