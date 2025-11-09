import { WorkflowNodeTypes } from '../../../nodes';
import { NodeShownOrder } from '../constants';
import { NodeCategory, NodeSearchIndex, NodeSearchLookup } from '../types';

/**
 * 노드 검색
 * 
 * 일부 매칭되는 키워드를 모두 Index 순서대로 반환
 */
export function searchNodes(query: string, searchIndex: NodeSearchIndex): string[] {
    const queryLower = query.toLowerCase();

    const duplicate = new Set<string>();
    const searched: string[] = [];
    for (const { keyword, value } of searchIndex) {
        if (!keyword.includes(queryLower)) continue;
        if (duplicate.has(value)) continue;

        searched.push(value);
        duplicate.add(value);
    }

    return searched;
}

/**
 * 노드 검색 인덱스 생성
 */
export function buildSearchIndex() {
    const searchIndex: NodeSearchIndex = [];
    const a: Record<string, NodeCategory> = {};
    for (const category of NodeShownOrder) {
        for (const nodeId of category.nodes) {
            const node = WorkflowNodeTypes[nodeId];

            for (const a of node.data.alias) {
                searchIndex.push({
                    keyword: a.toLowerCase(),
                    value: nodeId,
                    category: category.categoryName,
                });
            }
        }
    }

    return searchIndex;
}

/**
 * 노드 검색 Lookup 생성
 */
export function buildSearchLookup(): NodeSearchLookup {
    const lookup: NodeSearchLookup = {};

    for (const category of NodeShownOrder) {
        for (const nodeId of category.nodes) {
            lookup[nodeId] = {
                value: nodeId,
                category: category.categoryName,
            };
        }
    }

    return lookup;
}

/**
 * 노드명을 카테고리별 그룹화
 * @param nodeNames
*/
export function groupNodesByCategory(nodeNames: string[], lookup: NodeSearchLookup): NodeCategory[] {
    const result: NodeCategory[] = [];

    let lastCategory: NodeCategory | null = null;
    for (const n of nodeNames) {
        console.log(lookup, n);
        const { category, value } = lookup[n];

        if (!lastCategory || lastCategory.categoryName !== category) {
            lastCategory = {
                categoryName: category,
                nodes: [],
            };
            result.push(lastCategory);
        }

        lastCategory?.nodes.push(value);
    }

    return result;
}