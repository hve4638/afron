import { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { useBus, useOn } from '@/lib/zustbus';

import { useRTStore } from '@/context/RTContext';
import { RTFlowNodeOptions } from '@afron/types';
import { navigateBus } from '@/events/navigate';
import { RTWorkflowModel } from '@/features/workflow/models/RTWorkflowModel';

export interface PromptTemplateEvent {
    select_prompt: { promptId: string };
    select_and_open_prompt_editor: { promptId: string; };

    open_prompt_editor: { promptId: string };
}

interface usePromptTemplateOptionProps {
    option: RTFlowNodeOptions.PromptTemplate;
    setOption: Dispatch<SetStateAction<RTFlowNodeOptions.PromptTemplate>>;
}

export function usePromptTemplateNodeOption({
    option,
    setOption,
}: usePromptTemplateOptionProps) {
    const rt = useRTStore();
    const promptTemplateBus = useBus<PromptTemplateEvent>();
    const workflowModel = useMemo(() => RTWorkflowModel.From(rt.id), [rt.id]);

    useOn(promptTemplateBus.on.select_prompt, ({ promptId }) => {
        setOption((prev) => ({
            ...prev,
            prompt_id: promptId,
        }));
    });

    useOn(promptTemplateBus.on.select_and_open_prompt_editor, async ({ promptId }) => {
        setOption((prev) => ({
            ...prev,
            prompt_id: promptId,
        }));

        navigateBus.emit.goto_prompt_editor({ rtId: rt.id, promptId });
    });

    useOn(promptTemplateBus.on.open_prompt_editor, async ({ promptId }) => {
        navigateBus.emit.goto_prompt_editor({ rtId: rt.id, promptId });
    });

    useEffect(() => {
        workflowModel.getPromptTree()
            .then((prompts) => {
                console.log('Fetched prompts:', prompts);
            });
    }, [workflowModel]);

    return {
        emitPromptTemplate: promptTemplateBus.emit,
    }
}