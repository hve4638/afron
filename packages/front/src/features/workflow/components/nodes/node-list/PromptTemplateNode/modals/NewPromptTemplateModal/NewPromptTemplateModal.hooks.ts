import { RTWorkflowModel } from '@/features/workflow/models/RTWorkflowModel';
import { Emit } from '@/lib/zustbus';
import { useEffect, useMemo, useState } from 'react';
import { PromptTemplateEvent } from '../../PromptTemplateNodeOption.hooks';

interface UseNewPromptTemplateModalProps {
    rtId: string;
    emitPromptTemplate: Emit<PromptTemplateEvent>;
}

export function useNewPromptTemplateModal({
    rtId,
    emitPromptTemplate,
}: UseNewPromptTemplateModalProps) {
    const workflowModel = useMemo(() => RTWorkflowModel.From(rtId), [rtId]);
    const [promptId, setPromptId] = useState<string | null>(null);
    const [name, setName] = useState<string>('새 프롬프트');

    const clickCreateButton = async () => {
        if (!promptId) return;
        console.log('Create prompt template with name:', name, promptId);

        await workflowModel.createPrompt(promptId!, name);
        emitPromptTemplate('select_and_open_prompt_editor', { promptId });
    }

    useEffect(() => {
        setPromptId(null);
        workflowModel.generateNewPromptId()
            .then(pid => setPromptId(pid));
    }, []);

    return {
        states: {
            name,
            promptId,
        },
        actions: {
            setName,
            clickCreateButton,
        }
    }
}