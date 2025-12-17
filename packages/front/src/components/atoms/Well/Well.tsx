import classNames from 'classnames';

import styles from './Well.module.scss';
import { ReactNodeProps } from '@/types';
import { useEffect, useRef } from 'react';
import { WellItem } from './WelIItem';

interface WellProps extends ReactNodeProps.Common {
    children?: React.ReactNode;
}

export function Well({
    className,
    style,
    children,
}: WellProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={containerRef}
            className={classNames(styles['well'], className)}
            style={style}
        >
            {children}
        </div>
    )
}

Well.Item = WellItem;