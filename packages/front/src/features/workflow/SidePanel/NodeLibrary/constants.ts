import { WorkflowNodeTypes } from '../../nodes';

export const NodeTypeNames: Array<keyof typeof WorkflowNodeTypes> = [
    'rt-input',
    'llm-fetch',
    'prompt-template',
    'rt-output',
];
