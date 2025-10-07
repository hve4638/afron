import { NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { HandleTypes } from './types';
import { buildNodeData } from './utils';

import Button from '@/components/Button';
import { Align, Column, Gap, Row } from '@/components/layout';
import { NodeOption } from './NodeOption';
import { useWorkflowContext } from '../context';

export function LLMFetchNode(props: NodeProps) {
    const { data } = useWorkflowContext();
    const nodeData = data[props.id] ?? {};

    return (
        <BaseNode
            title='LLM'
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
                <NodeOption label='max tokens' value={nodeData.data?.['max_tokens']}/>
                <NodeOption label='top p' value={nodeData.data?.['top']}/>
                {/* <Gap h='2px' /> */}
                {/* <Button>
                    고급 설정
                </Button> */}
            </Column>
        </BaseNode>
    )
}


LLMFetchNode.nodeType = 'llm-fetch' as const;
LLMFetchNode.data = buildNodeData(
    'LLM',
    [
        ['messages', HandleTypes.ChatMessages],
    ],
    [
        ['llm result', HandleTypes.LLMResult],
    ]
);