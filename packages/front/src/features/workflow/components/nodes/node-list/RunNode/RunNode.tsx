import { useMemo } from 'react';
import { NodeProps } from '@xyflow/react';

import { Column } from '@/components/layout';

import { useWorkflowContext } from '@/features/workflow/context';

import { BaseNode } from '../../components/BaseNode';
import { buildNodeData, NodeHandle } from '../../utils';

import { RTFlowNodeOptions } from '@afron/types';
import { RunNodeOption } from './RunNodeOption';
import { DEFAULT_RUN_NODE_DATA } from './constant';

export function RunNode(props: NodeProps) {
    const { getNodeData } = useWorkflowContext();
    const nodeData = getNodeData<RTFlowNodeOptions.RTStart>(props.id);

    const condition = useMemo(() => {
        switch (nodeData.data.start_trigger) {
            case 'start':
                return '실행 버튼 클릭 시';
            case 'press-button':
                if (nodeData.data.button_label) {
                    return `버튼 클릭 시: ${nodeData.data.button_label}`;
                }
                else {
                    return `버튼 클릭 시`;
                }
            default:
                return `조건 없음: ${nodeData.data.start_trigger}`;
        }
    }, [nodeData.data.start_trigger, nodeData.data.button_label]);

    return (
        <BaseNode
            title='시작'
            nodeData={nodeData}
            {...props}
        >
            <hr />
            <Column
                style={{
                    padding: '0 0.5em',
                    color: 'grey',
                }}
            >
                <div>{condition}</div>
            </Column>
        </BaseNode>
    )
}
RunNode.data = buildNodeData({
    type: 'rt-run',
    alias: ['실행', 'start', '시작'],
    outputs: [
        NodeHandle.Input(),
    ],
    defaultNodeData: DEFAULT_RUN_NODE_DATA,
});
RunNode.Option = RunNodeOption;