import {
    InputNode,
    OutputNode,
    PromptTemplateNode,
    LLMFetchNode,
 } from './node-list';

export const WorkflowNodeTypes = {
    [InputNode.nodeType]: InputNode,
    [OutputNode.nodeType]: OutputNode,
    [PromptTemplateNode.nodeType]: PromptTemplateNode,
    [LLMFetchNode.nodeType]: LLMFetchNode,
} as const;
export type WorkflowNodeTypeNames = keyof typeof WorkflowNodeTypes;

export { isHandleCompatible } from './utils';

export * from './types';