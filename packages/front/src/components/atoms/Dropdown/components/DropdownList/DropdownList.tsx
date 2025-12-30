import React, { forwardRef, useLayoutEffect, useState } from 'react';
import classNames from 'classnames';

import styles from './DropdownList.module.scss';

interface DropdownListProps {
    className?: string;
    style?: React.CSSProperties;
    parentRef: React.RefObject<HTMLDivElement | null>;
    reposition?: (inner: DOMRect, parent: DOMRect) => { left?: number; top: number; width: number };
    repositionTrigger?: unknown;

    children?: React.ReactNode;
}
interface Position {
    left?: number;
    top?: number;
    width: number;
}

export const DropdownList = forwardRef<HTMLDivElement, DropdownListProps>(({
    className = '',
    style = {},
    reposition = ({ left, top, width }: DOMRect) => ({ left, top, width }),
    repositionTrigger,
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
    }, [repositionTrigger]);

    const { left, top, width } = position;
    console.log('position', position);
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