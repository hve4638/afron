import { NodeProps } from '@xyflow/react';
import { useWorkflowContext } from '@/features/workflow/context';

import { BaseNode } from '../../components/BaseNode';
import { buildNodeData, NodeHandle } from '../../utils';
import { OutputNodeOption } from './OutputNodeOption';
import { DEFAULT_OUTPUT_NODE_DATA } from './constants';

export function OutputNode(props: NodeProps) {
    const { getNodeData } = useWorkflowContext();
    const nodeData = getNodeData(props.id);

    return (
        <BaseNode
            title={OutputNode.data.name}
            nodeData={nodeData}
            {...props}
        >
        </BaseNode>
    )
}
OutputNode.data = buildNodeData({
    type: 'rt-output',
    name: '출력',
    alias: ['응답 반환'],
    inputs: [
        NodeHandle.Output(),
    ],
    defaultNodeData: DEFAULT_OUTPUT_NODE_DATA,
});
OutputNode.Option = OutputNodeOption;