import { useEffect, useMemo, useState } from 'react';

import { NodeShownOrder } from './constants';
import { NodeCategory, NodeSearchIndex, NodeSearchLookup } from './types';
import { buildSearchIndex, buildSearchLookup, searchNodes } from './utils';
import { groupNodesByCategory } from './utils/search';

let SearchIndexCache: NodeSearchIndex | null = null;
let SearchLookupCache: NodeSearchLookup | null = null;

export function useNodeLibrary() {
    const [searchText, setSearchText] = useState('');

    const nodeList: NodeCategory[] = useMemo(() => {
        if (!SearchLookupCache) return [];
        if (searchText.length === 0) {
            return NodeShownOrder;
        }
        else if (!SearchIndexCache) {
            return [];
        }
        else {
            const nodes = searchNodes(searchText, SearchIndexCache);
            const grouped = groupNodesByCategory(nodes, SearchLookupCache);
            
            return grouped;
        }
    }, [searchText]);

    useEffect(() => {
        // 최초 1회 searchIndex 및 searchLookup 생성

        if (SearchIndexCache == null) {
            SearchIndexCache = buildSearchIndex();
        }

        if (SearchLookupCache == null) {
            SearchLookupCache = buildSearchLookup();
        }
    }, []);

    return {
        searchText,
        setSearchText,

        nodeList,
    }
}