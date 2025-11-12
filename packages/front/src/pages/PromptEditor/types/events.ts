import { Ping } from '@/lib/zustbus';

export interface PromptEditorEvent {
    save: Ping;
    back: Ping;

    open_varedit_modal: { varId: string; };
    open_prompt_only_config_modal: Ping;

    on_save: Ping;
}

export interface PromptDataUpdateEvent {
    updated: Ping;
    // Readonly<PromptEditorData> | null;
}