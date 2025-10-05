import { NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { HandleTypes } from './types';
import { buildNodeData } from './utils';

import Button from '@/components/Button';
import { Align, Column, Gap, Row } from '@/components/layout';
import { NodeOption } from './NodeOption';

export function LLMFetchNode(props: NodeProps) {
    return (
        <BaseNode
            title='LLM'
            {...props}
        >
            <hr />
            <Column
                style={{
                    padding: '0 2px',
                }}
            >
                <NodeOption label='model' value='선택'/>
                <NodeOption label='max tokens' value='1024'/>
                <NodeOption label='top p' value='1'/>
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