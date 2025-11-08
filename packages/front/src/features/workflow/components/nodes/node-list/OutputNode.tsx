import { NodeProps } from '@xyflow/react';
import { BaseNode } from '../BaseNode/BaseNode';
import { HandleTypes } from '../types';
import { buildNodeData, NodeHandle } from '../utils';
import { useWorkflowContext } from '../../../context';

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
OutputNode.data = buildNodeData({
    type: 'rt-output',
    alias: ['output', '출력'],
    inputs: [
        NodeHandle.Output(),
    ],
});