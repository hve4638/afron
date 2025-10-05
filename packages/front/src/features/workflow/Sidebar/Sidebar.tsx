import { Align, Column, Flex, Gap, Row } from '@/components/layout';
import styles from './Sidebar.module.scss';
import { GIconButton } from '@/components/GoogleFontIcon';
import { Form } from '@/components/forms';
import ModelForm from '@/components/model-ui';
import { LLMOption } from './options/LLMOption';
import { FlowNode } from '@/lib/xyflow';
import { useMemo } from 'react';
import { WorkflowNodeTypes } from '../nodes';
import { PromptTemplateOption } from './options';
import { Textarea } from '@/components/ui/Textarea';

interface SidebarProps {
    node: FlowNode;
    onClose?: () => void;
}

export function Sidebar({
    node,
    onClose
}: SidebarProps) {
    console.log('Sidebar node', node);
    if (node) {
        console.group('Node Info');
        console.log(node.id)
        console.log(node.type);
        console.log(node.data);
        console.log();
        console.log(node.measured);
        console.groupEnd();
    }
    const title = (node.data['label'] ?? 'Unknown') as string;

    const option = useMemo(() => {
        if (node.type === 'llm-fetch') {
            return <LLMOption />;
        }
        else if (node.type === 'prompt-template') {
            return <PromptTemplateOption />;
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