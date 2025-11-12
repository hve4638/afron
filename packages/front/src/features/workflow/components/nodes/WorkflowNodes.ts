import {
    PromptTemplateNode,
    LLMFetchNode,
    RunNode,
    OutputNode,
} from './node-list';

export const WorkflowNodes = {
    [RunNode.data.type]: RunNode,
    [OutputNode.data.type]: OutputNode,
    [PromptTemplateNode.data.type]: PromptTemplateNode,
    [LLMFetchNode.data.type]: LLMFetchNode,
} as const;
export type WorkflowNodeNames = keyof typeof WorkflowNodes;