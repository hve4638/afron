import { NodeProps } from '@xyflow/react';
import { BaseNode } from './base';
import { HandleTypes } from './types';
import { buildNodeData } from './utils';

export function PromptTemplateNode(props: NodeProps) {
    return (
        <BaseNode
            {...props}
        >
        </BaseNode>
    )
}

PromptTemplateNode.nodeType = 'prompt-template';
PromptTemplateNode.data = buildNodeData(
    'Prompt Template',
    [
        ['input', HandleTypes.Input],
    ],
    [
        ['messsages', HandleTypes.ChatMessages],
    ]
);