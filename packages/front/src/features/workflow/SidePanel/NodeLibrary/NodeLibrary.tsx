import { useEffect, useState } from 'react';
import classNames from 'classnames';

import { Align, Column, Flex, Gap, Row } from '@/components/layout';
import { TextInput } from '@/components/Input';

import { useNodeLibrary } from './NodeLibrary.hooks';
import { WorkflowNodeTypes } from '../../nodes';
import { DRAG_NODE_TYPE } from '../../constants';

import styles from '../SidePanel.module.scss';

interface NodeLibraryProps {

}

export function NodeLibrary({

}: NodeLibraryProps) {
    const {
        searchText,
        setSearchText,

        nodeList,
    } = useNodeLibrary();

    return (
        <Column
            className={styles['left-panel']}
            style={{
                position: 'absolute',
                zIndex: 1001,
                left: '0px',
                top: '0px',
                width: '250px',
            }}
            onDrop={(e) => {
                e.stopPropagation();
                e.preventDefault();
            }}
        >
            <Row
                className='undraggable'
                style={{
                    height: '1em',
                }}
                columnAlign={Align.Center}
            >
                <div>노드 라이브러리</div>
            </Row>
            <Gap h='8px' />
            <TextInput
                className={classNames('undraggable')}
                value={searchText}
                onChange={(value) => setSearchText(value)}
                instantChange={true}
                placeholder='노드 검색'
            />
            <Gap h='8px' />
            <Column
                style={{
                    gap: '2px',
                    overflowY: 'auto',
                }}
            >
                {
                    nodeList.map((nodeId) => (
                        <NodeItem key={nodeId} nodeId={nodeId} />
                    ))
                }
            </Column>
        </Column>
    )
}

function NodeItem({
    nodeId,
}: {
    nodeId: keyof typeof WorkflowNodeTypes
}) {
    const [isDragging, setIsDragging] = useState(false);

    const onDragStart = (event: React.DragEvent) => {
        event.dataTransfer.setData(DRAG_NODE_TYPE, nodeId);
        event.dataTransfer.effectAllowed = 'move';
        setIsDragging(true);
    };

    const onDragEnd = () => {
        setIsDragging(false);
    };

    return (
        <div
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            style={{
                cursor: isDragging ? 'grabbing' : 'grab',
                padding: '2px',
                borderRadius: '4px',
                background: '#2a2a2a',
                transition: 'background 0.2s, opacity 0.2s',
                opacity: isDragging ? 0.5 : 1,
            }}
            onMouseOver={(e) => !isDragging && (e.currentTarget.style.background = '#3a3a3a')}
            onMouseOut={(e) => e.currentTarget.style.background = '#2a2a2a'}
        >
            {WorkflowNodeTypes[nodeId].data.alias[0] ?? nodeId}
        </div>
    )
}