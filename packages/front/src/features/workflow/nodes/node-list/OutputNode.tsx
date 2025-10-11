import { NodeProps } from '@xyflow/react';
import { BaseNode } from '../BaseNode';
import { HandleTypes } from '../types';
import { buildNodeData } from '../utils';
import { useWorkflowContext } from '../../context';

export function OutputNode(props: NodeProps) {
    const { getNodeData } = useWorkflowContext();
    const nodeData = getNodeData(props.id);

    return (
        <BaseNode
            title='출력'
            nodeData={nodeData}
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