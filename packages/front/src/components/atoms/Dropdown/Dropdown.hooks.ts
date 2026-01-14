import React, { useEffect, useState, useRef, useMemo, useLayoutEffect } from 'react';

import { DropdownItem, DropdownItemList } from './types';
import { convertDropdownItem } from './utils';
import { useDropdownItems } from './hooks/useDropdownItems';
import useRerender from '@/hooks/useTrigger';
import useTrigger from '@/hooks/useTrigger';

interface UseDropdownProps<T> {
    children: React.ReactNode;

    value: T;
    onChange: (item: T) => void;
    onItemNotFound: (firstItem: T | null) => void;
}

type DropdownItems<T> = (DropdownItem<T> | DropdownItemList<T>)[];

export function useDropdown<T>({ children, onItemNotFound, value, onChange }: UseDropdownProps<T>) {
    const headerRef: React.Ref<HTMLDivElement> = useRef(null);
    const layer1ListRef: React.Ref<HTMLDivElement> = useRef(null);
    const layer2ListRef: React.Ref<HTMLDivElement> = useRef(null);

    const [isOpen, setIsOpen] = useState(false);
    // 1계층에서 어디에 포커스를 두는지 키로 저장, Group일 경우 2계층을 보여주기 위해 사용됨
    const [focusedLayer1ItemKey, setFocusedLayer1ItemKey] = useState<string | null>(null);

    const options = useDropdownItems<T>({ children });

    const layer2ItemsCache = useMemo(() => {
        if (focusedLayer1ItemKey == null) return null;

        const item = options.find(item => item.key === focusedLayer1ItemKey);
        if (!item) return null;
        else if ('list' in item) return item.list;
        else return null;
    }, [focusedLayer1ItemKey])

    const [focusedLayer1Item, setFocusedLayer1Item] = useState<DropdownItem<T> | DropdownItemList<T> | null>();
    const [focusedLayer1ItemRect, setFocusedLayer1ItemRect] = useState<{
        top: number; left: number;
        width: number; height: number;
    }>();

    const [selectedItem, setSelectedItem] = useState<DropdownItem<T> | null>(null);
    const [selectedItemList, setSelectedItemList] = useState<DropdownItemList<T>[]>([]);

    useLayoutEffect(() => {
        // 현재 선택된 아이템 지정
        // 아이템이 없으면 onItemNotFound 호출
        let firstItem: T | null = null;
        for (const option of options) {
            if (option.isLeaf) {
                firstItem ??= option.value;
                if (option.value === value) {
                    setSelectedItem(option);
                    setSelectedItemList([]);
                    return;
                }
            }
            else {
                for (const subitem of option.list) {
                    firstItem ??= subitem.value;

                    if (subitem.value === value) {
                        setSelectedItem(subitem);
                        setSelectedItemList([option]);
                        return;
                    }
                }
            }
        }

        onItemNotFound(firstItem);
        setSelectedItem(null);
        setSelectedItemList([]);
    }, [options, value, onItemNotFound]);

    useEffect(() => {
        // Dropdown 외부 클릭 시 닫힘 이벤트 
        const handleClick = (event) => {
            if (isOpen) {
                if (
                    !headerRef.current?.contains(event.target)
                    && !layer1ListRef.current?.contains(event.target)
                    && !layer2ListRef.current?.contains(event.target)
                ) {
                    setIsOpen(false);
                }
            }
        }

        if (!isOpen) {
            setFocusedLayer1ItemKey(null);
        }

        document.addEventListener('click', handleClick);
        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [isOpen]);

    const [resizeKey, triggerResize] = useTrigger();
    useEffect(() => {
        const handleResize = () => {
            triggerResize();
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const focusLayer1 = (item: DropdownItem<T> | DropdownItemList<T>, rect?: DOMRect) => {
        setFocusedLayer1ItemRect(rect ?? {
            top: 0,
            left: 0,
            width: 0,
            height: 0,
        });
        setFocusedLayer1ItemKey(item.key);
        setFocusedLayer1Item(item)
    }

    const clickItem = (item: DropdownItem<T>) => {
        setIsOpen(false);
        if (value !== item.key) {
            onChange(item.value);
        }
    }

    return {
        state: {
            resizeKey,
            options,
            selectedItem,
            selectedItemList,
            isOpen,
            layer2ItemsCache,
            focusedLayer1Item,
            focusedLayer1ItemRect,
        },
        setState: {
            isOpen: setIsOpen,
        },
        ref: {
            headerRef,
            layer1ListRef,
            layer2ListRef
        },
        action: {
            focusLayer1,
            clickItem
        }
    };
}

export default useDropdown;