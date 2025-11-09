import { useState } from 'react';
import classNames from 'classnames';

import { DRAG_NODE_TYPE } from '@/features/workflow/constants';

import { WorkflowNodeTypes } from '../../../../nodes';

import styles from './NodeItem.module.scss';

interface NodeItemProps {
    nodeId: keyof typeof WorkflowNodeTypes;
}

export function NodeItem({
    nodeId,
}: NodeItemProps) {
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
            className={classNames(styles['node-item'], {
                [styles['dragging']]: isDragging,
            })}
            
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
        >
            {WorkflowNodeTypes[nodeId].data.alias[0] ?? nodeId}
        </div>
    )
}