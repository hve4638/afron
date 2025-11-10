import { NodeProps } from '@xyflow/react';
import { Column } from '@/components/layout';

import { buildNodeData, NodeHandle } from '../../utils';
import { BaseNode } from '../../components/BaseNode';

import { useWorkflowContext } from '../../../../context';
import { PromptTemplateNodeOption } from './PromptTemplateNodeOption';

export function PromptTemplateNode(props: NodeProps) {
    const { getNodeData } = useWorkflowContext();
    const nodeData = getNodeData(props.id);

    return (
        <BaseNode
            title='프롬프트 템플릿'
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
    alias: ['프롬프트 구성', 'prompt template'],
    inputs: [
        NodeHandle.Input(),
    ],
    outputs: [
        NodeHandle.ChatMessages(),
    ],
});
PromptTemplateNode.Option = PromptTemplateNodeOption;