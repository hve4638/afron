import { useEffect, useMemo, useState } from 'react';

import { WorkflowNodeTypeNames, WorkflowNodeTypes } from '../../nodes';
import { NodeTypeNames } from './constants';

let NodeSearchCache: Array<{
    keyword: string;
    value: WorkflowNodeTypeNames;
}> | null = null;

export function useNodeLibrary() {
    const [searchText, setSearchText] = useState('');

    const nodeList: Array<WorkflowNodeTypeNames> = useMemo(() => {
        if (searchText.length === 0) return NodeTypeNames;
        if (!NodeSearchCache) return [];

        const target = searchText.toLowerCase();

        const searched: WorkflowNodeTypeNames[] = [];
        const searchDuplicate = new Set<WorkflowNodeTypeNames>();
        for (const { keyword, value } of NodeSearchCache) {
            if (!keyword.includes(target)) {
                continue;
            }
            if (searchDuplicate.has(value)) {
                continue;
            }

            searched.push(value);
            searchDuplicate.add(value);
        }
        return searched;
    }, [searchText]);

    useEffect(() => {
        // 최초 1회 search cache 생성
        if (NodeSearchCache != null) return;

        NodeSearchCache = [];
        for (const nodeId of NodeTypeNames) {
            const node = WorkflowNodeTypes[nodeId];
            
            for (const a of node.data.alias) {
                NodeSearchCache.push({
                    keyword: a.toLowerCase(),
                    value: nodeId,
                });
            }
        }
    }, []);

    return {
        searchText,
        setSearchText,

        nodeList,
    }
}