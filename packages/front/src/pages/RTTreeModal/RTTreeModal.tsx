import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './styles.module.scss';

import { Modal, ModalHeader, useModalInstance } from '@/features/modal';
import { GoogleFontIcon } from '@/components/atoms/GoogleFontIcon';
import { Align, Grid, Row } from 'components/layout';
import Button from '@/components/atoms/Button';

import { TreeDirectory, TreeNode } from './TreeNode';
import { relocateTree } from './utils';
import { TreeDirectoryData, TreeNodeData, TreeOffsets, } from './types';
import { Regions } from './TreeNode/types';
import type { RTNodeTree } from '@/types/rt-node'
import { RTMetadataTree } from '@afron/types';

type PromptTreeModalProps = {
    item: RTNodeTree;
    onConfirm: (item: RTMetadataTree) => void;
    onCancel: () => void;
}

function RTTreeModal({
    item,
    onConfirm,
    onCancel,
}: PromptTreeModalProps) {
    const { t } = useTranslation();
    const { closeModal } = useModalInstance();

    // 드래그 인디케이터 위치지정
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [draggingNode, setDraggingNode] = useState<{
        node: TreeNodeData;
        offsets: TreeOffsets;
    } | null>(null);
    const [hoveredNode, setHoveredNode] = useState<{
        node: TreeNodeData | TreeDirectoryData;
        offsets: TreeOffsets;
        region: Regions;
    } | null>(null);
    const [tree, setTree] = useState<RTMetadataTree>(item);

    const makeNode = (node: any, offsets: number[] = []) => {
        const key = offsets.join('_') + '_' + node.name;
        if (node.type === 'directory') {
            return (
                <TreeDirectory
                    name={node.name}
                    key={key}
                    edited={node.edited ?? false}
                    added={node.added ?? false}
                    mouseRegionCount={
                        draggingNode
                            ? 3
                            : 0
                    }
                    onRegionMouseEnter={(e, region) => {
                        setHoveredNode({
                            node: node,
                            offsets: offsets as TreeOffsets,
                            region: region,
                        });
                    }}
                    onRegionMouseLeave={(e, region) => {
                        setHoveredNode(prev => {
                            if (prev &&
                                prev.node === node &&
                                prev.region === region
                            ) {
                                return null;
                            }
                            else {
                                return prev;
                            }
                        });
                    }}
                >
                    {
                        node.children.map(
                            (child: any, index: number) => makeNode(child, [...offsets, index])
                        )
                    }
                </TreeDirectory>
            );
        }
        else {
            return (
                <TreeNode
                    name={node.name}
                    key={key}
                    edited={node.edited ?? false}
                    added={node.added ?? false}
                    mouseRegionCount={
                        !draggingNode
                            ? 1
                            : (
                                draggingNode.node === node
                                    ? 1
                                    : 2
                            )
                    }
                    onRegionMouseEnter={(e, region) => {
                        setHoveredNode({
                            node: node,
                            offsets: offsets as TreeOffsets,
                            region: region,
                        });
                    }}
                    onRegionMouseLeave={(e, region) => {
                        setHoveredNode(prev => {
                            if (prev &&
                                prev.node === node &&
                                prev.region === region
                            ) {
                                return null;
                            }
                            else {
                                return prev;
                            }
                        });
                    }}
                    onDragBegin={() => {
                        setDraggingNode({
                            node: node,
                            offsets: offsets as TreeOffsets,
                        });
                    }}
                />
            );
        }
    }

    const submit = () => {
        onConfirm(tree);
        closeModal();
    }
    const cancel = () => {
        onCancel();
        closeModal();
    }

    // 트리 노드 드래그 해제
    useEffect(() => {
        const handleMouseUp = () => {
            if (draggingNode) {
                setTree(prev => {
                    if (!hoveredNode) {
                        return prev;
                    }
                    else if (hoveredNode.node.type === 'directory') {
                        if (hoveredNode.region === Regions.Top) {
                            const offsets: TreeOffsets = [...hoveredNode.offsets];
                            offsets[offsets.length - 1] -= 1;
                            return relocateTree(prev, draggingNode.offsets, offsets);
                        }
                        else if (hoveredNode.region === Regions.Bottom) {
                            const offsets: TreeOffsets = [...hoveredNode.offsets];
                            offsets[offsets.length - 1] += 1;
                            return relocateTree(prev, draggingNode.offsets, offsets);
                        }
                        else if (hoveredNode.region === Regions.Center) {
                            const offsets: TreeOffsets = [...hoveredNode.offsets];
                            offsets.push(hoveredNode.node.children.length);
                            return relocateTree(prev, draggingNode.offsets, offsets);
                        }
                    }
                    else {
                        if (hoveredNode.region === Regions.Top) {
                            return relocateTree(prev, draggingNode.offsets, hoveredNode.offsets);
                        }
                        else if (hoveredNode.region === Regions.Bottom) {
                            const offsets: TreeOffsets = [...hoveredNode.offsets];
                            offsets[offsets.length - 1] += 1;
                            return relocateTree(prev, draggingNode.offsets, offsets);
                        }
                    }
                    return prev;
                })

                setDraggingNode(null);
            }
        };

        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [tree, draggingNode, hoveredNode]);

    useEffect(() => {
        const updateMousePosition = (event) => {
            setMousePosition({
                x: event.clientX,
                y: event.clientY,
            });
        };

        window.addEventListener('mousemove', updateMousePosition);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
        };
    }, []);

    return (
        <Modal
            style={{
                maxHeight: '80%',
            }}
        >
            <Grid
                columns='1fr'
                rows='48px 24px 1fr 32px'
                style={{
                    height: '100%',
                }}
            >
                <ModalHeader showCloseButton={false}>{t('prompt.save')}</ModalHeader>
                <Row rowAlign={Align.End}>
                    <GoogleFontIcon
                        value='create_new_folder'
                        enableHoverEffect={true}
                        style={{
                            fontSize: '20px',
                            width: '22px',
                            height: '22px',
                        }}
                    />
                </Row>
                <div
                    className={
                        classNames(
                            styles['tree-container'],
                            'undraggable'
                        )
                    }
                    style={{
                        display: 'block',
                        overflow: 'auto',
                        height: '100%',
                    }}
                >

                    {
                        tree.map((node, index) => makeNode(node, [index]))
                    }
                </div>
                <Row
                    rowAlign={Align.End}
                    style={{
                        height: '100%',
                    }}
                >
                    <Button
                        onClick={submit}
                        style={{
                            width: '80px',
                            height: '100%',
                            marginRight: '8px'
                        }}
                    >확인</Button>
                    <Button
                        className='transparent'
                        onClick={cancel}
                        style={{
                            width: '80px',
                            height: '100%'
                        }}
                    >취소</Button>
                </Row>
            </Grid>
            {
                draggingNode != null &&
                createPortal(
                    <div
                        className={
                            styles['drag-indicator']
                        }
                        style={{
                            left: mousePosition.x + 16,
                            top: mousePosition.y,
                        }}
                    >
                        {draggingNode.node.name}
                    </div>
                    , document.body)
            }
        </Modal>
    );
}

export default RTTreeModal;