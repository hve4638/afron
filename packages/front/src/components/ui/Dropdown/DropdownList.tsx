import React, { useMemo, useRef, useCallback, forwardRef, useLayoutEffect, useState } from 'react';
import classNames from 'classnames';

import styles from './Dropdown.module.scss';

interface DropdownListProps {
    className?: string;
    style?: React.CSSProperties;
    parentRef: React.RefObject<HTMLDivElement>;
    reposition?: (inner: DOMRect, parent: DOMRect) => { left?: number; top: number; width: number };

    children?: React.ReactNode;
}
1
interface Position {
    left?: number;
    top?: number;
    width: number;
}

const DropdownList = forwardRef<HTMLDivElement, DropdownListProps>(({
    className = '',
    style = {},
    reposition = ({ left, top, width }: DOMRect) => ({ left, top, width }),
    children,
    parentRef,
}, forwardedRef) => {
    const [position, setPosition] = useState<Position>({ left: 0, top: 0, width: 0 });

    useLayoutEffect(() => {
        const innerRef = forwardedRef as React.RefObject<HTMLDivElement>;

        const parentRect = (
            (parentRef.current)
            ? parentRef.current.getBoundingClientRect()
            : { left: 0, top: 0, width: 0, right: 0, bottom: 0, height: 0, x: 0, y: 0 } as DOMRect
        );

        if (innerRef.current) {
            const innerRect = innerRef.current.getBoundingClientRect();
            setPosition(reposition(innerRect, parentRect));
        }


    }, []);


    const { left, top, width } = position;
    return (
        <div
            ref={forwardedRef}
            className={classNames(styles['dropdown-list'], className)}
            style={{
                left,
                top,
                minWidth: width,
                ...style,
            }}
        >
            {
                children != null &&
                children
            }
        </div>
    );
});

export default DropdownList;