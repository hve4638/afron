import { NodeProps } from '@xyflow/react';
import { useWorkflowContext } from '@/features/workflow/context';

import { BaseNode } from '../BaseNode/BaseNode';

import { buildNodeData, NodeHandle } from '../utils';
import { Column } from '@/components/layout';

export function StartNode(props: NodeProps) {
    const { getNodeData } = useWorkflowContext();
    const nodeData = getNodeData(props.id);

    return (
        <BaseNode
            title='시작'
            nodeData={nodeData}
            {...props}
        >
            <hr />
            <Column
                style={{
                    padding: '0 2px',
                    color: 'grey',
                }}
            >
                <div>실행 시</div>
            </Column>
        </BaseNode>
    )
}
StartNode.data = buildNodeData({
    type: 'rt-start',
    alias: ['start', '시작'],
    outputs: [
        NodeHandle.Input(),
    ],
});