export interface PromptTemplateEvent {
    select_prompt: { promptId: string };
    select_and_open_prompt_editor: { promptId: string; name: string; };

    open_prompt_editor: { promptId: string };
}