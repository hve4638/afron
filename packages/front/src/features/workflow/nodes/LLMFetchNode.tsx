import { NodeProps } from '@xyflow/react';
import { BaseNode } from './base';
import { HandleTypes } from './types';
import { buildNodeData } from './utils';

export function LLMFetchNode(props: NodeProps) {
    return (
        <BaseNode
            {...props}
        >
        </BaseNode>
    )
}

LLMFetchNode.nodeType = 'llm-fetch';
LLMFetchNode.data = buildNodeData(
    'LLM',
    [
        ['messages', HandleTypes.ChatMessages],
    ],
    [
        ['llm result', HandleTypes.LLMResult],
    ]
);