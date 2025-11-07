import { Children, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

import { ITreeDirectoryNode, ITreeLeafNode, ITreeNode } from '@/components/TreeView/types';

import useHotkey from '@/hooks/useHotkey';
import { useModal } from '@/hooks/useModal';
import { emitEvent } from '@/hooks/useEvent';
import useModalDisappear from '@/hooks/useModalDisappear';

import { DeleteConfirmDialog } from '@/modals/Dialog';
import { RTExportPreviewModal } from '../RTExportModal';
import { RTTreeModel } from '@/features/rt';

type useRTEditModalProps = {
    isFocused: boolean;
    onClose: () => void;
}

function useRTEditModal({
    isFocused,
    onClose
}: useRTEditModalProps) {
    const modal = useModal();
    const rtTreeModel = useMemo(() => new RTTreeModel(), []);
    const [tree, setTree] = useState<Readonly<ITreeNode<string>[]>>([]);

    const rerenderTree = async () => {
        setTree(await rtTreeModel.getTree());
    }

    const relocate = async (nodes: Readonly<ITreeNode<string>[]>) => {
        await rtTreeModel.relocate(nodes);

        rerenderTree();
    }

    const addDirectory = async () => {
        const name = t('rt.new_directory');
        await rtTreeModel.addDirectory(name);

        rerenderTree();
    }

    const rename = async (value: string, newName: string) => {
        await rtTreeModel.rename(value, newName);

        rerenderTree();
    }

    const deleteNode = async (value: string) => {
        await rtTreeModel.deleteNode(value);

        rerenderTree();
    }

    const deleteDirectory = async (value: string) => {
        await rtTreeModel.deleteDirectory(value);

        rerenderTree();
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

    const confirmDirectoryDeletion = (name: string, value: string) => {
        modal.open(DeleteConfirmDialog, {
            onDelete: async () => {
                deleteDirectory(value);
                return true;
            },
            onCancel: async () => {
                return true;
            },
        });
    }

    const openRTExportModal = (rtId: string) => {
        modal.open(RTExportPreviewModal, {
            rtId,
        });
    }

    // 초기 트리 로드
    useEffect(() => {
        rerenderTree();
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
                relocate,

                addDirectory,
                deleteDirectory,
                deleteNode,
                rename,
            },

            confirmNodeDeletion,
            confirmDirectoryDeletion,
            openRTExportModal,
        }
    }
}

export default useRTEditModal;