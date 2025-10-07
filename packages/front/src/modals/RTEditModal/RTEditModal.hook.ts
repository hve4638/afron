import { Children, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

import { ITreeDirectoryNode, ITreeLeafNode, ITreeNode } from '@/components/TreeView/types';

import useHotkey from '@/hooks/useHotkey';
import { useModal } from '@/hooks/useModal';
import { emitEvent } from '@/hooks/useEvent';
import useModalDisappear from '@/hooks/useModalDisappear';

import { DeleteConfirmDialog } from '@/modals/Dialog';

import ProfileEvent from '@/features/profile-event';

import { RTExportPreviewModal } from '../RTExportModal';

type useRTEditModalProps = {
    isFocused: boolean;
    onClose: () => void;
}

function useRTEditModal({
    isFocused,
    onClose
}: useRTEditModalProps) {
    const modal = useModal();
    const nextDirIdRef = useRef<number>(0);

    const [tree, setTree] = useState<ITreeNode<string>[]>([]);

    const nextDirId = () => `__dir_${nextDirIdRef.current++}`

    const relocateTree = async (nodes: ITreeNode<string>[]) => {
        setTree(nodes);

        const next: RTMetadataTree = nodes.map((node) => {
            if (node.type === 'directory') {
                return {
                    type: 'directory',
                    name: node.name,
                    children: node.children.map(
                        (child) => ({
                            type: 'node',
                            name: child.name,
                            id: child.value,
                        } satisfies RTMetadataNode)
                    ),
                } satisfies RTMetadataDirectory;
            }
            else {
                return {
                    type: 'node',
                    name: node.name,
                    id: node.value,
                } satisfies RTMetadataNode;
            }
        })

        await ProfileEvent.rt.updateTree(next);
        emitEvent('refresh_rt_tree');
    }

    const addDirectoryNode = async () => {
        relocateTree([
            ...tree,
            {
                name: t('rt.new_directory'),
                type: 'directory',
                value: nextDirId(),
                children: [],
            } satisfies ITreeDirectoryNode<string>,
        ]);
    }

    const renameNode = async (value: string, newName: string) => {
        const nameTrimmed = newName.trim();
        if (nameTrimmed.length === 0) {
            return;
        }

        const findNode: (nodes: ITreeNode<string>[], value: string) => ITreeNode<string> | null = (nodes, value) => {
            for (const node of nodes) {
                if (node.value === value) {
                    return node;
                }
                if (node.type === 'directory') {
                    const found = findNode(node.children, value);
                    if (found) return found;
                }
            }

            return null;
        }

        const node = findNode(tree, value);
        if (node) {
            const next = [...tree];
            node.name = nameTrimmed;
            if (node.type === 'node') {
                await ProfileEvent.rt.rename(value, nameTrimmed);
            }

            relocateTree(next);
        }
    }

    const confirmNodeDeletion = (name: string, value: string) => {
        modal.open(DeleteConfirmDialog, {
            onDelete: async () => {
                deleteNode(value);
                return true;
            },
            onCancel: async () => {
                return true;
            },
        });
    }

    const deleteNode = async (value: string) => {
        const promises: Promise<void>[] = [];
        const next = tree.flatMap((node) => {
            if (node.value !== value) return [node];
            else {
                if (node.type === 'directory') {
                    return node.children;
                }
                else {
                    promises.push(
                        ProfileEvent.rt.remove(node.value)
                    );
                    return [];
                }
            }
        });

        await Promise.all(promises);

        relocateTree(next);
    }

    const openRTExportModal = (rtId: string) => {
        modal.open(RTExportPreviewModal, {
            rtId,
        });
    }

    useEffect(() => {
        ProfileEvent.rt.getTree()
            .then((tree) => {
                const tree2 = tree.map((node) => {
                    if (node.type === 'directory') {
                        return {
                            name: node.name,
                            value: nextDirId(),
                            type: 'directory',
                            children: node.children.map((child) => ({
                                type: 'node',
                                name: child.name,
                                value: child.id,
                            })),
                        } as ITreeDirectoryNode<string>;
                    }

                    return {
                        type: 'node',
                        name: node.name,
                        value: node.id,
                    } as ITreeLeafNode<string>;
                });
                setTree(tree2);
            });
    }, []);

    const [disappear, close] = useModalDisappear(onClose);
    useHotkey({
        'Escape': close,
    }, isFocused, []);

    return {
        state: {
            tree,
            disappear,
        },
        action: {
            navigatePromptEditor: (rtId: string) => {
                emitEvent('goto_rt_editor', { rtId });
            },
            close,

            tree: {
                relocate: relocateTree,

                addDirectoryNode,
                renameNode,
            },

            confirmNodeDeletion,
            openRTExportModal,
        }
    }
}

export default useRTEditModal;