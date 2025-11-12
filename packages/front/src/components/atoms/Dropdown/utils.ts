import React from 'react';
import { DropdownItem, DropdownItemList } from "./types";

const getItemType = (node: React.ReactNode) => {
    if (Array.isArray(node)) {
        return 'array';
    }
    else if (
        !React.isValidElement(node)
        || !('name' in node.props)
    ) {
        return null;
    }
    else if ('value' in node.props) {
        return 'item';
    }
    else if ('children' in node.props) {
        return 'list';
    }

    return null;
}
export const convertDropdownItem = <T,>(item: React.ReactNode, i: number) => {
    const itemType = getItemType(item);
    
    if (itemType === 'array') {
        return (item as Array<React.ReactNode>).map((item, i) => convertDropdownItem(item, i)) as Array<DropdownItemList<T>>;
    }
    else if (itemType === 'item') {
        const { name, value } = (item as any).props;
        return {
            isLeaf: true,
            name: name as string,
            value: value as T,
            key: `${i}-${name}`
        } as DropdownItem<T>;
    }
    else if (itemType === 'list') {
        const { name, children } = (item as any).props;
        const nodes = Array.isArray(children) ? children : [children];

        return {
            isLeaf: false,
            name,
            list: nodes.flatMap((node: React.ReactNode, i: number) => {
                const result = convertDropdownItem(node, i);
                return result ? [result] : [];
            }),
            key: `${i}-${name}`
        } as DropdownItemList<T>;
    }

    console.error('Invalid dropdown item:', item);
    return null;
}
