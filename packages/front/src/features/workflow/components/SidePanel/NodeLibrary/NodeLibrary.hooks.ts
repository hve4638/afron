import { useEffect, useMemo, useState } from 'react';

import { NodeShownOrder } from './constants';
import { NodeCategory, NodeSearchIndex, NodeSearchLookup } from './types';
import { buildSearchIndex, buildSearchLookup, searchNodes } from './utils';
import { groupNodesByCategory } from './utils/search';

let SearchIndexCache: NodeSearchIndex = buildSearchIndex();
let SearchLookupCache: NodeSearchLookup = buildSearchLookup();

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

    return {
        searchText,
        setSearchText,

        nodeList,
    }
}