import { WorkflowNodeTypeNames } from '../../nodes';
import { NodeCategory } from './types';

/**
 * 사이드패널에 표시할 노드 카테고리 및 노드 순서 정의
 */
export const NodeShownOrder: Array<NodeCategory> = [
    category('기본', [
        'rt-start',
    ]),
    category('프롬프트 처리', [
        'prompt-template',
    ]),
    category('언어 모델', [
        'llm-fetch',
    ]),
    category('응답 반환', [
        'rt-end',
    ]),
] as const;

function category(categoryName: string, nodes: Array<WorkflowNodeTypeNames>): NodeCategory {
    return {
        categoryName,
        nodes,
    }
}
