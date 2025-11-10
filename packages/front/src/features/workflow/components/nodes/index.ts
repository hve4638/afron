import {
    PromptTemplateNode,
    LLMFetchNode,
    RunNode,
    OutputNode,
} from './node-list';

export const WorkflowNodeTypes = {
    [RunNode.data.type]: RunNode,
    [OutputNode.data.type]: OutputNode,
    [PromptTemplateNode.data.type]: PromptTemplateNode,
    [LLMFetchNode.data.type]: LLMFetchNode,
} as const;
export type WorkflowNodeTypeNames = keyof typeof WorkflowNodeTypes;

export { isHandleCompatible } from './utils';
export * from './types';
export {
    PromptTemplateNode,
    LLMFetchNode,
    RunNode,
    OutputNode,
} from './node-list';