import React, { useEffect, useState, useRef, useMemo, useCallback, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import { GIcon } from '@/components/GoogleFontIcon';

import { DropdownItem, DropdownProps } from './types';
import Group from './Group';
import Item from './Item';
import useDropdown from './Dropdown.hook';

import DropdownList from './DropdownList';
import DropdownOption from './DropdownOption';

import styles from './Dropdown.module.scss';

const Dropdown = <T,>({
    className = '',
    style = {},

    listProps = {},
    itemProps = {},

    value,
    onChange = () => { },
    onItemNotFound = () => { },
    children,
}: DropdownProps<T>) => {
    const {
        state: {
            options,
            selectedItem,
            isOpen,
            layer2ItemsCache,
            focusedLayer1ItemRect,
        },
        setState,
        ref: {
            headerRef,
            layer1ListRef,
            layer2ListRef,
        },
        action: {
            focusLayer1,
            clickItem,
        }
    } = useDropdown({
        children,
        onItemNotFound,
        value,
        onChange,
    });

    return (
        <div
            className={classNames(styles['dropdown-container'], className)}
            style={style}
        >
            <div
                ref={headerRef}
                className={classNames(styles['dropdown-header'])}
                style={{
                    height: '100%'
                }}
                onClick={() => setState.isOpen(prev => !prev)}
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        setState.isOpen(prev => !prev);
                    }
                }}
            >
                {selectedItem?.name}
                <GIcon value='arrow_drop_down' />
            </div>
            {
                isOpen &&
                ReactDOM.createPortal(
                    <DropdownList
                        className={classNames(listProps.className)}
                        style={listProps.style}
                        ref={layer1ListRef}
                        parentRef={headerRef}
                        reposition={({ left, bottom, width }) => ({
                            left,
                            top: bottom + 2,
                            width,
                        })}
                    >
                        {
                            options.map((option, index) => (
                                <DropdownOption
                                    key={index}

                                    className={classNames(itemProps.className)}
                                    style={itemProps.style}
                                    item={option}

                                    // renderItem={renderLayer1Item}
                                    onFocus={(rect) => {
                                        focusLayer1(option, rect);
                                    }}
                                    onClick={() => {
                                        clickItem(option as DropdownItem<T>);
                                    }}
                                />
                            ))
                        }
                    </DropdownList>
                    , document.getElementById('app') ?? document.body)
            }
            {
                isOpen &&
                layer2ItemsCache != null &&
                ReactDOM.createPortal(
                    <DropdownList
                        ref={layer2ListRef}

                        className={classNames(listProps.className)}
                        style={listProps.style}
                        parentRef={layer1ListRef}

                        reposition={({ left, width, top }) => ({
                            left: left + width + 2,
                            top: focusedLayer1ItemRect?.top ?? 0,
                            width,
                        })}
                    >
                        {
                            layer2ItemsCache.map((option, index) => (
                                <DropdownOption
                                    key={index}
                                    className={classNames(itemProps.className)}
                                    style={itemProps.style}
                                    item={option}
                                    
                                    // renderItem={renderLayer2Item}
                                    onClick={() => {
                                        clickItem(option as DropdownItem<T>);
                                    }}
                                />
                            ))
                        }
                    </DropdownList>
                    , document.getElementById('app') ?? document.body)
            }
        </div>
    );
}

Dropdown.Group = Group;
Dropdown.Item = Item;

export default Dropdown;