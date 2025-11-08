import { NodeProps } from '@xyflow/react';
import { useWorkflowContext } from '@/features/workflow/context';

import { BaseNode } from '../BaseNode/BaseNode';
import { buildNodeData, NodeHandle } from '../utils';
import { HandleTypes } from '../types';


export function InputNode(props: NodeProps) {
    const { getNodeData } = useWorkflowContext();
    const nodeData = getNodeData(props.id);

    return (
        <BaseNode
            title='입력'
            nodeData={nodeData}
            {...props}
        >
            <div>fff</div>
        </BaseNode>
    )
}

InputNode.data = buildNodeData({
    type: 'rt-input',
    alias: ['input', '입력'],
    outputs: [
        NodeHandle.Input(),
    ]
});