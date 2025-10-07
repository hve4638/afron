import { NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { HandleTypes } from './types';
import { buildNodeData } from './utils';
import { useWorkflowContext } from '../context';

export function InputNode(props: NodeProps) {
    const { data } = useWorkflowContext();
    const nodeData = data[props.id];

    return (
        <BaseNode
            title='입력'
            nodeData={nodeData}
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