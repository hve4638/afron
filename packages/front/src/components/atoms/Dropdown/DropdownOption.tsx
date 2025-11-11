import { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import type { DropdownItem, DropdownItemList, GroupRenderProps, ItemRenderProps } from './types';

import styles from './Dropdown.module.scss';
import { GIcon } from '@/components/atoms/GoogleFontIcon';
import { Align, Row } from '@/components/layout';

interface DropdownItemProps<T> {
    className?: string;
    style?: React.CSSProperties;
    item: DropdownItem<T> | DropdownItemList<T>
    parents?: Array<DropdownItemList<T>>;

    onClick?: () => void;
    onHover?: () => void;
    onHoverLeave?: () => void;
    onFocus?: (rect: DOMRect | undefined) => void;

    renderItem?: (props: ItemRenderProps<T>) => React.ReactNode;
    renderGroup?: (props: GroupRenderProps<T>) => React.ReactNode;
}

function DropdownOption<T>({
    className = '',
    style = {},
    item,
    parents = [],
    onFocus = (rect) => { },
    onClick = () => { },

    renderItem = (item) => item.name,
    renderGroup = (item) => item.name,
}: DropdownItemProps<T>) {
    const optionRef: React.LegacyRef<HTMLDivElement> = useRef(null);
    const [hover, setHover] = useState(false);

    useEffect(() => {
        let to: number;
        if (hover) {
            to = window.setTimeout(() => {
                const rect = optionRef.current?.getBoundingClientRect();

                onFocus(rect);
            }, 45);
        }

        return () => {
            window.clearTimeout(to);
        }
    }, [hover]);

    return (
        <Row
            ref={optionRef}
            className={
                classNames(
                    styles['dropdown-item'],
                    { [styles['dropdown-array']]: 'list' in item },
                    className,
                )
            }
            style={{
                ...style,
                height: '1em'
            }}
            tabIndex={0}
            onMouseEnter={(e) => {
                setHover(true);
            }}
            onMouseLeave={(e) => {
                setHover(false);
            }}
            onClick={(e) => {
                if (!('list' in item)) {
                    onClick();
                }
            }}
            columnAlign={Align.Center}
        >
            {
                item.isLeaf
                    ? renderItem({
                        name: item.name,
                        value: item.value,
                        parents: parents,
                        selected: false,
                    })
                    : renderGroup({
                        name: item.name,
                        parents: parents,
                        focused: false,
                    })
            }
        </Row>
    )
}

export default DropdownOption;