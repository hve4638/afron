export type Metadata = {
    version: string;
    id: string;
    name: string;
    uuid: string;
    mode: 'flow' | 'prompt_only';
    input_type: 'normal' | 'chat';
    forms: string[];
    entrypoint_node: number;
    prompts: PromptOrder;
}

type PromptOrder = {
    id: string;
    name: string;
}[];