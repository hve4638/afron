import { FlowNode } from '@/lib/xyflow';

import { Align, Column, Flex, Gap, Row } from '@/components/layout';
import { GIconButton } from '@/components/atoms/GoogleFontIcon';
import { Textarea } from '@/components/atoms/Textarea';
import { useNodeOptionPanel } from './NodeOptionPanel.hooks';

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
        state: {
            title,
            description,
        },
        setSpecificNodeData,
        optionElement,
    } = useNodeOptionPanel({ node, onClose });

    return (
        <Column
            className={styles['sidebar']}
            style={{
                zIndex: 1001,
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
                value={description ?? ''}
                onChange={(e) => {
                    setSpecificNodeData((prev) => ({
                        ...prev,
                        description: e.target.value,
                    }));
                }}
            />
            <Gap h='0.5em' />
            {optionElement}
            <Gap h='0.1em' />
        </Column>
    )
}