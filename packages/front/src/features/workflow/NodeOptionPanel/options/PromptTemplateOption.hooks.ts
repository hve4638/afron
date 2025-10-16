import { Dispatch, SetStateAction } from 'react';
import { useBus } from '@/lib/zustbus';

import { useRTStore } from '@/context/RTContext';
import { RTFlowNodeOptions } from '@afron/types';
import { useNavigate } from 'react-router';
import { emitNavigate } from '@/events/navigate';
export interface PromptTemplateEvent {
    select_prompt_id: { promptId: string };

    select_and_navigate_prompt_id: { promptId: string; name: string; };

    open_prompt_editor: { promptId: string };
}

interface usePromptTemplateOptionProps {
    option: RTFlowNodeOptions.PromptTemplate;
    setOption: Dispatch<SetStateAction<RTFlowNodeOptions.PromptTemplate>>;
}

export function usePromptTemplateOption({
    option,
    setOption,
}: usePromptTemplateOptionProps) {
    const navigate = useNavigate();
    const rt = useRTStore();
    const [_, emitPromptTemplate, usePromptTemplateEvent] = useBus<PromptTemplateEvent>();

    usePromptTemplateEvent('select_prompt_id', ({ promptId }) => {
        setOption((prev) => ({
            ...prev,
            prompt_id: promptId,
        }));
    });

    usePromptTemplateEvent('select_and_navigate_prompt_id', async ({ promptId, name }) => {
        setOption((prev) => ({
            ...prev,
            prompt_id: promptId,
        }));
        await rt.update.promptName(promptId, name);
        emitNavigate('goto_prompt_editor', { rtId: rt.id, promptId });
    });

    usePromptTemplateEvent('open_prompt_editor', async ({ promptId }) => {
        emitNavigate('goto_prompt_editor', { rtId: rt.id, promptId });
    });

    return {
        emitPromptTemplate,
    }
}