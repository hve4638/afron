import { SetStateAction, useCallback, useMemo } from 'react';
import FocusLock from 'react-focus-lock';
import { FlowNode } from '@/lib/xyflow';

import { Align, Column, Flex, Gap, Row } from '@/components/layout';
import { GIconButton } from '@/components/GoogleFontIcon';
import { Textarea } from '@/components/ui/Textarea';

import { PromptTemplateOption, LLMOption } from './options';
import { useWorkflowContext } from '../context';

import styles from './NodeOptionPanel.module.scss';

interface NodeOptionPanelProps {
    node: FlowNode;
    onClose?: () => void;
}

export function NodeOptionPanel({
    node,
    onClose,
}: NodeOptionPanelProps) {
    const {
        data,
        getNodeData,
        setNodeData,
        removeNodeData,
    } = useWorkflowContext();
    const nodeData = useMemo(() => getNodeData(node.id), [data, node]);

    const setSpecificNodeData = useCallback((data: SetStateAction<RTFlowNodeData>) => {
        setNodeData(node.id, data);
    }, [setNodeData, node]);
    const removeSpecificNodeData = useCallback(() => {
        removeNodeData(node.id);
    }, [removeNodeData, node]);

    const option = useMemo(() => nodeData.data ?? {}, [nodeData]);
    const setOption = useCallback((next: SetStateAction<Record<string, any>>) => {
        if (typeof next === 'function') {
            next = next(nodeData.data) as Record<string, any>;
        }

        setNodeData(node.id, (prev) => ({
            ...prev,
            data: next,
        }));
    }, [nodeData, setNodeData]);

    const title = (node.data['label'] ?? 'Unknown') as string;
    const optionComponent = useMemo(() => {
        const props = {
            nodeData,
            setNodeData: setSpecificNodeData,
            removeNodeData: removeSpecificNodeData,

            option,
            setOption,
        }

        if (node.type === 'llm-fetch') {
            return <LLMOption {...props} />;
        }
        else if (node.type === 'prompt-template') {
            return <PromptTemplateOption {...props} />;
        }

        return null;
    }, [nodeData, node]);

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
                    value='keep'
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
                    setSpecificNodeData((prev) => ({
                        ...prev,
                        description: e.target.value,
                    }));
                }}
            />
            {
                optionComponent != null &&
                <>
                    <Gap h='16px' />
                    {optionComponent}
                </>
            }
        </Column>
    )
}