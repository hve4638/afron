import { createBus, Ping } from '@/lib/zustbus';

interface NavigateEvent {
    goto_workflow_editor: { rtId: string; };
    goto_prompt_editor: { rtId: string; promptId: string; };

    goto_test: Ping;

    goto_home: Ping;
    back: Ping;
}

export const navigateBus = createBus<NavigateEvent>();
