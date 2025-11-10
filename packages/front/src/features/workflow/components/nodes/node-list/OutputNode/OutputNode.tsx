import { NodeProps } from '@xyflow/react';
import { useWorkflowContext } from '@/features/workflow/context';

import { BaseNode } from '../../components/BaseNode';
import { buildNodeData, NodeHandle } from '../../utils';
import { OutputNodeOption } from './OutputNodeOption';

export function OutputNode(props: NodeProps) {
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
OutputNode.data = buildNodeData({
    type: 'rt-output',
    alias: ['출력', '응답 반환'],
    inputs: [
        NodeHandle.Output(),
    ],
});
OutputNode.Option = OutputNodeOption;