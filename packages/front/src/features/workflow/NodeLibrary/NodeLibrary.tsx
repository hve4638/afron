import { Align, Column, Flex, Gap, Row } from '@/components/layout';

import { GIconButton } from '@/components/GoogleFontIcon';
import styles from './NodeLibrary.module.scss';
import { WorkflowNodeTypes } from '../nodes';

interface SidebarProps {

}

export function NodeLibrary({

}: SidebarProps) {

    return (
        <Column
            className={styles['sidebar']}
            style={{
                position: 'absolute',
                zIndex: 1001,
                left: '8px',
                top: '8px',
                width: '250px',
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
                <div>노드 라이브러리</div>
                <Flex />
                <GIconButton
                    value='unfold_less'
                    style={{
                        fontSize: '1.4em',
                    }}
                    hoverEffect='square'
                // onClick={onClose}
                />
            </Row>
            <Gap h='8px' />
            <div>노드 </div>
            <NodeItem nodeId='rt-input'/>
            <NodeItem nodeId='llm-fetch'/>
            <NodeItem nodeId='prompt-template'/>
            <NodeItem nodeId='rt-output'/>
        </Column>
    )
}

function NodeItem({
    nodeId,
}:{
    nodeId: keyof typeof WorkflowNodeTypes
}) {
    return (
        <div
            className='undraggable'
        >
            {WorkflowNodeTypes[nodeId].data.label}
        </div>
    )
}