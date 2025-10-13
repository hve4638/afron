import { NodeProps } from '@xyflow/react';
import { useWorkflowContext } from '@/features/workflow/context';

import { BaseNode } from '../BaseNode';
import { buildNodeData, NodeHandle } from '../utils';

export function EndNode(props: NodeProps) {
    const { getNodeData } = useWorkflowContext();
    const nodeData = getNodeData(props.id);

    return (
        <BaseNode
            title='종료'
            nodeData={nodeData}
            {...props}
        >
        </BaseNode>
    )
}
EndNode.data = buildNodeData({
    type: 'rt-end',
    alias: ['end', '종료'],
    inputs: [
        NodeHandle.Output(),
    ],
});