import { useEffect, useMemo, useState } from 'react';

import TreeView, { directory, node, Tree } from '@/components/TreeView';
import { Emit } from '@/lib/zustbus';
import { useModal } from '@/hooks/useModal';
import { NewPromptTemplateModal } from '../NewPromptTemplateModal/NewPromptTemplateModal';
import { RTWorkflowModel } from '@/features/workflow/models/RTWorkflowModel';
import { useKeyBind } from '@/hooks/useKeyBind';
import { PromptTemplateEvent } from '../../PromptTemplateNodeOption.hooks';

interface SelectPromptTemplateModalProps {
    closeModal: () => void;
    focused: boolean;

    initPromptId: string | null;
    rtId: string;
    emitPromptTemplate: Emit<PromptTemplateEvent>;
}

export function useSelectPromptTemplateModal({
    closeModal = () => { },
    focused,

    rtId,
    initPromptId,
    emitPromptTemplate
}: SelectPromptTemplateModalProps) {
    const modals = useModal();
    const workflowModel = useMemo(() => RTWorkflowModel.From(rtId), [rtId]);

    const [tree, setTree] = useState<Tree<string | Symbol>>([]);
    const [selected, setSelected] = useState<string | null>(initPromptId);

    useKeyBind({
        'Esc': () => closeModal(),
    }, [focused], focused);

    useEffect(() => {
        workflowModel
            .getPromptTree()
            .then((t) => setTree(t));
    }, [workflowModel]);

    const relocateTree = async (next: Tree<string | Symbol>) => {
        setTree(next);
    }

    const renamePrompt = async (promptId: string, renamed: string) => {
        setTree((prev) => {
            const next = [...prev];
            const index = next.findIndex(({ value }) => value === promptId);
            if (index !== -1) {
                next[index] = { ...next[index], name: renamed };
            }
            return next;
        });
    }

    const selectPrompt = async (promptId: string) => {
        setSelected(promptId);
        emitPromptTemplate('select_prompt', { promptId });
    }

    const openNewPromptTemplateModal = async () => {
        modals.open(NewPromptTemplateModal, { emitPromptTemplate, rtId, });
    }

    return {
        states: {
            tree,
            selected,
        },
        actions: {
            renamePrompt,
            selectPrompt,
            relocateTree,

            openNewPromptTemplateModal,
        },
    }
}