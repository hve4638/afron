import React from 'react';
import { CommonProps, ReactNodeProps } from '@/types';

export interface DropdownProps<T> extends CommonProps {
    children: React.ReactNode;

    listProps?: ReactNodeProps.Common;
    itemProps?: ItemProps<T>;

    value: T;
    onChange?: (item: T) => void;
    onItemNotFound?: (firstItem: T | null) => void;
}

export interface ItemProps<T> extends CommonProps {
    render?: (props: ItemRenderProps<T>) => React.ReactNode;
}

export interface ItemRenderProps<T> {
    name: string;
    value: T;
    selected: boolean;
}

export type DropdownItem<T> = {
    isLeaf: true;

    name: string;
    value: T;
    key: string;
};
export type DropdownItemList<T> = {
    isLeaf: false;

    name: string;
    list: DropdownItem<T>[];
    key: string;
};