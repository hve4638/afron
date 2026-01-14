import { useMemo } from 'react';
import { DropdownItem, DropdownItemList } from '../types';
import { convertDropdownItem } from '../utils';

export type DropdownItems<T> = (DropdownItem<T> | DropdownItemList<T>)[];

export function useDropdownItems<T>({
    children
}: {
    children: React.ReactNode
}): DropdownItems<T> {

    return useMemo(() => {
        const target: React.ReactNode[] = (
            Array.isArray(children) ? children : [children]
        );

        const result = target.flatMap((item, i) => {
            const result = convertDropdownItem<T>(item, i);
            return (
                result == null ? []
                    : Array.isArray(result) ? result
                        : [result]
            );
        });

        return result;
    }, [children]);
}