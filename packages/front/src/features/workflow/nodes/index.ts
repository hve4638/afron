import { InputNode } from './InputNode';
import { OutputNode } from './OutputNode';
import { PromptTemplateNode } from './PromptTemplateNode';
import { LLMFetchNode } from './LLMFetchNode';

export const WorkflowNodeTypes = {
    [InputNode.nodeType]: InputNode,
    [OutputNode.nodeType]: OutputNode,
    [PromptTemplateNode.nodeType]: PromptTemplateNode,
    [LLMFetchNode.nodeType]: LLMFetchNode,
} as const;

export { isHandleCompatible } from './utils';