import { SupportedVerbosity } from '../chatai';

export type FlowNodeType = (
    'rt-input'
    | 'rt-start'
    | 'rt-end'
    | 'rt-output'
    | 'prompt-template'
    | 'llm-fetch'
);

export type RTFlowData = Record<string, RTFlowNodeData>;
export type RTFlowNodeData<TData = Record<string, any>> = {
    type: FlowNodeType;
    description: string;
    data: TData;
    connection: Array<{
        from_handle: string;
        to_node: string;
        to_handle: string;
    }>;
    position: {
        x: number;
        y: number;
    };
}

export declare namespace RTFlowNodeOptions {
    interface RTStart {
        start_trigger: 'start' | 'press-button';

        button_label: string;

        include_chat_history: boolean;


        allow_input_text: boolean;
        allow_input_image: boolean;
        allow_input_pdf: boolean;
        allow_input_files: boolean;
    }

    interface PromptTemplate {
        prompt_id: string | null;
    }

    interface LLM {
        model: string;
        model_selection: boolean;


        temperature: number;
        top_p: number;
        max_tokens: number;
        use_thinking: boolean;
        thinking_tokens: number;
        gpt_reasoning_effort: SupportedVerbosity;
        gpt_verbosity: SupportedVerbosity;
    }
}

export { };