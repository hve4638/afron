import { Align, Column, Flex, Gap, Row } from '@/components/layout';
import styles from './Sidebar.module.scss';
import { GIconButton } from '@/components/GoogleFontIcon';
import { Form } from '@/components/forms';
import ModelForm from '@/components/model-ui';
import { LLMOption } from './options/LLMOption';
import { FlowNode } from '@/lib/xyflow';
import { RefObject, useMemo } from 'react';
import { WorkflowNodeTypes } from '../nodes';
import { PromptTemplateOption } from './options';
import { Textarea } from '@/components/ui/Textarea';
import { OptionProps } from './options';

interface SidebarProps {
    node: FlowNode;
    data: RefObject<RTFlowData>;
    refresh: () => void;

    onClose?: () => void;
}

export function Sidebar({
    node,
    data,
    refresh,

    onClose,
}: SidebarProps) {
    const nodeData = useMemo(() => {
        return (data.current?.[node.id] ?? {}) as RTFlowNodeData;
    }, [node, data]);

    const title = (node.data['label'] ?? 'Unknown') as string;
    const option = useMemo(() => {
        if (node.type === 'llm-fetch') {
            return <LLMOption nodeData={nodeData!} refresh={refresh} />;
        }
        else if (node.type === 'prompt-template') {
            return <PromptTemplateOption nodeData={nodeData!} refresh={refresh} />;
        }

        return null;
    }, [node]);
    
    return (
        <Column
            className={styles['sidebar']}
            style={{
                position: 'absolute',
                zIndex: 1001,
                right: '8px',
                top: '8px',
                width: '350px',
            }}
        >
            <Row
                className='undraggable'
                style={{
                    height: '1.2em',
                    fontSize: '1.2em',
                }}
                columnAlign={Align.Center}
            >
                <strong>{title}</strong>
                <Flex />
                <GIconButton
                    value='close'
                    style={{
                        fontSize: '1.4em',
                    }}
                    hoverEffect='square'
                    onClick={onClose}
                />
            </Row>
            <Gap h='8px' />

            <div className='undraggable'>설명</div>
            <Textarea
                style={{
                    borderRadius: '2px',
                    height: '4em',
                    fontSize: '0.75em',
                }}
                value={nodeData.description ?? ''}
                onChange={(e) => {
                    nodeData.description = e.target.value;
                    refresh();
                }}
            />
            {
                option != null &&
                <>
                    <Gap h='16px' />
                    {option}
                </>
            }
        </Column>
    )
}