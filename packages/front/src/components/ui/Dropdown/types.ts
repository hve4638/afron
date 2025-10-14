import React from 'react';
import { CommonProps, ReactNodeProps } from '@/types';

export interface DropdownProps<T> extends CommonProps {
    children: React.ReactNode;

    listProps?: ReactNodeProps.Common;
    itemProps?: ItemProps<T>;

    value: T;
    onChange?: (item: T) => void;
    onItemNotFound?: (firstItem: T | null) => void;
    align?: 'left' | 'right';

    renderSelectedItem?: (props: SelectedItemRenderProps<T>) => React.ReactNode;
}

export interface ItemProps<T> extends CommonProps {
    renderItem?: (props: ItemRenderProps<T>) => React.ReactNode;
    renderGroup?: (props: GroupRenderProps<T>) => React.ReactNode;
}

export interface SelectedItemRenderProps<T> {
    name: string;
    value: T;
    
    parents: Array<DropdownItemList<T>>;
}

export interface ItemRenderProps<T> {
    name: string;
    value: T;
    
    parents: Array<DropdownItemList<T>>;
    selected: boolean;
}

export interface GroupRenderProps<T> {
    name: string;
    
    parents: Array<DropdownItemList<T>>;
    focused: boolean;
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