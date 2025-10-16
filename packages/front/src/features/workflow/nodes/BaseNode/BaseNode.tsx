import classNames from 'classnames';
import {
    Handle,
    Position,
    type NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Align, Column, Gap, Row } from '@/components/layout';
import { CommonProps } from '@/types';
import { useBaseNode } from './BaseNode.hook';

import styles from './BaseNode.module.scss';
import { RTFlowNodeData } from '@afron/types';

export interface BaseNodeProps extends NodeProps, CommonProps {
    title: string;
    nodeData: RTFlowNodeData;

    children?: React.ReactNode;
}

export function BaseNode({
    title,
    nodeData,

    className,
    style,
    data,
    children,
    selected,
}: BaseNodeProps) {
    const { defaultHandles, handles } = useBaseNode({
        data: data as any,
    });
    const label = (title ?? 'Unknown') as string;

    return (
        <Column
            className={
                classNames(
                    className,
                    styles['node'],
                    {
                        selected,
                    },
                )
            }
            style={{
                ...style,
                minWidth: '130px',
                maxWidth: '160px',
                minHeight: '2.5em',
                fontSize: '12px',
            }}
            columnAlign={Align.Center}
        >
            <Row rowAlign={Align.Center}>
                {label}
            </Row>
            {
                handles.length > 0 &&
                <hr className={styles['divider']} />
            }
            {defaultHandles}
            {handles}
            {children}
            {
                nodeData.description !== '' &&
                <>
                    <div className={styles['description']}>{nodeData.description}</div>
                </>
            }
        </Column>
    );
}