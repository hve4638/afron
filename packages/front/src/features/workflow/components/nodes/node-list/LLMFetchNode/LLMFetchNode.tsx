import { NodeProps } from '@xyflow/react';
import { Column } from '@/components/layout';

import { BaseNode } from '../../components/BaseNode';
import { buildNodeData, NodeHandle } from '../../utils';

import { NodeOption } from '../../components/NodeOption';
import { useWorkflowContext } from '../../../../context';
import { LLMFetchNodeOption } from './LLMFetchNodeOption';
import { RTFlowNodeOptions } from '@afron/types';
import { DEFAULT_LLM_FETCH_NODE_DATA } from './constants';

export function LLMFetchNode(props: NodeProps) {
    const { getNodeData } = useWorkflowContext();
    const nodeData = getNodeData<RTFlowNodeOptions.LLM>(props.id);

    return (
        <BaseNode
            title={LLMFetchNode.data.name}
            nodeData={nodeData}
            {...props}
        >
            <hr />
            <Column
                style={{
                    padding: '0 2px',
                }}
            >
                <NodeOption label='model' value='선택'/>
                <NodeOption label='max tokens' value={nodeData.data.max_tokens}/>
                <NodeOption label='top p' value={nodeData.data.top_p}/>
                {/* <Gap h='2px' /> */}
                {/* <Button>
                    고급 설정
                </Button> */}
            </Column>
        </BaseNode>
    )
}

LLMFetchNode.data = buildNodeData({
    type: 'llm-fetch',
    name: 'LLM 요청',
    alias: [],
    inputs: [
        NodeHandle.ChatMessages(),
    ],
    outputs: [
        NodeHandle.LLMResult(),
    ],
    defaultNodeData: DEFAULT_LLM_FETCH_NODE_DATA,
});
LLMFetchNode.Option = LLMFetchNodeOption;