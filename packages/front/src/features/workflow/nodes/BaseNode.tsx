import { useCallback, useMemo } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    BackgroundVariant,
    type OnConnect,
    Handle,
    Position,
    type NodeProps,
    type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Align, Gap, Row } from '@/components/layout';
import { HandleTypes, HandleColors } from './types';
import { CommonProps } from '@/types';
import classNames from 'classnames';
import styles from './BaseNode.module.scss';
import { useBaseNode } from './BaseNode.hook';

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
    const { handles } = useBaseNode({
        data,
    });
    const label = (title ?? 'Unknown') as string;

    return (
        <div
            className={
                classNames(
                    className,
                    styles['node'],
                    {
                        selected,
                    }
                )
            }
            style={{
                ...style,
                minWidth: '180px',
                maxWidth: '180px',
                fontSize: '12px',
            }}
        >
            <Row rowAlign={Align.Center}>
                {label}
            </Row>
            <hr className={styles['divider']} />
            {handles}
            {children}
            <Gap h='2px' />
            {
                nodeData.description !== ''
                &&
                <>
                    <div className={styles['description']}>{nodeData.description}</div>
                    <Gap h='2px' />
                </>
            }
        </div>
    );
}