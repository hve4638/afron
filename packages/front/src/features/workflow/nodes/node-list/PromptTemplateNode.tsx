import { NodeProps } from '@xyflow/react';
import { Column } from '@/components/layout';

import { buildNodeData } from '../utils';
import { HandleTypes } from '../types';
import { BaseNode } from '../BaseNode';

import { useWorkflowContext } from '../../context';

export function PromptTemplateNode(props: NodeProps) {
    const { getNodeData } = useWorkflowContext();
    const nodeData = getNodeData(props.id);

    return (
        <BaseNode
            title='프롬프트 템플릿'
            nodeData={nodeData}
            {...props}
        >
            <Column
                style={{
                    padding: '2px',
                }}
            >
                {/* <Button

                >
                    <Row
                        rowAlign={Align.Center}
                        columnAlign={Align.Center}
                    >
                        <GIcon value='edit' style={{ marginRight: '2px' }}/>
                        프롬프트 편집
                    </Row>
                </Button> */}
            </Column>
        </BaseNode>
    )
}

PromptTemplateNode.nodeType = 'prompt-template' as const;
PromptTemplateNode.data = buildNodeData(
    'Prompt Template',
    [
        ['input', HandleTypes.Input],
    ],
    [
        ['messages', HandleTypes.ChatMessages],
    ]
);