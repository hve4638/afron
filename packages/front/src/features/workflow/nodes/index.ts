import {
    InputNode,
    OutputNode,
    PromptTemplateNode,
    LLMFetchNode,
    StartNode,
    EndNode,
 } from './node-list';

export const WorkflowNodeTypes = {
    [StartNode.data.type]: StartNode,
    [EndNode.data.type]: EndNode,
    [InputNode.data.type]: InputNode,
    [OutputNode.data.type]: OutputNode,
    [PromptTemplateNode.data.type]: PromptTemplateNode,
    [LLMFetchNode.data.type]: LLMFetchNode,
} as const;
export type WorkflowNodeTypeNames = keyof typeof WorkflowNodeTypes;

export { isHandleCompatible } from './utils';

export * from './types';