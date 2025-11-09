import { useState } from 'react';
import classNames from 'classnames';

import { Align, Column, Gap, Row } from '@/components/layout';
import { TextInput } from '@/components/Input';

import { useNodeLibrary } from './NodeLibrary.hooks';
import { WorkflowNodeTypes } from '../../nodes';
import { DRAG_NODE_TYPE } from '../../../constants';

import styles from '../SidePanel.module.scss';
import { NodeFold, NodeItem } from './components';
import Delimiter from '@/components/Delimiter';

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
                <span>노드 라이브러리</span>
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
                    nodeList.map((category) => (
                        <NodeFold
                            key={category.categoryName}
                            label={category.categoryName}
                        >
                            {
                                category.nodes.map((nodeId) => (
                                    <NodeItem key={nodeId} nodeId={nodeId} />
                                ))
                            }
                        </NodeFold>
                    ))
                }
            </Column>
        </Column>
    )
}
