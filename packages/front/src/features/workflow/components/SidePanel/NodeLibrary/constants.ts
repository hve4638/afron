import { WorkflowNodeTypes } from '../../nodes';


/**
 * 노드 라이브러리 패널에 표시될 노드 순서
 */
export const NodeTypeNames: Array<keyof typeof WorkflowNodeTypes> = [
    'rt-start',
    'prompt-template',
    'llm-fetch',
    'rt-end',  
];
