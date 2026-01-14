import { NodeProps } from '@xyflow/react';
import { Column } from '@/components/layout';

import { buildNodeData, NodeHandle } from '../../utils';
import { BaseNode } from '../../components/BaseNode';

import { useWorkflowContext } from '../../../../context';
import { PromptTemplateNodeOption } from './PromptTemplateNodeOption';
import { DEFAULT_PROMPT_TEMPLATE_NODE_DATA } from './constants';

export function PromptTemplateNode(props: NodeProps) {
    const { getNodeData } = useWorkflowContext();
    const nodeData = getNodeData(props.id);

    return (
        <BaseNode
            title={PromptTemplateNode.data.name}
            nodeData={nodeData}
            {...props}
        >
            <hr />
            <Column
                style={{
                    padding: '2px',
                    color: 'grey',
                }}
            >
                {/* <span>프롬프트: rtId</span> */}
            </Column>
        </BaseNode>
    )
}
PromptTemplateNode.data = buildNodeData({
    type: 'prompt-template',
    name: '프롬프트 구성',
    alias: ['prompt template'],
    inputs: [
        NodeHandle.Input(),
    ],
    outputs: [
        NodeHandle.ChatMessages(),
    ],
    defaultNodeData: DEFAULT_PROMPT_TEMPLATE_NODE_DATA,
});
PromptTemplateNode.Option = PromptTemplateNodeOption;