import { RTFlowNodeOptions } from '@afron/types';

export const DEFAULT_LLM_FETCH_NODE_DATA: RTFlowNodeOptions.LLM = {
    model: 'gpt-5',
    model_selection: false,

    temperature: 0.7,
    top_p: 1,
    max_tokens: 1024,
    use_thinking: false,
    thinking_tokens: 512,
    gpt_reasoning_effort: 'medium',
    gpt_verbosity: 'medium',
};