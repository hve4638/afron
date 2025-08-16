import classNames from 'classnames';
import FocusLock from 'react-focus-lock';

import styles from './Well.module.scss';
import { CommonProps } from '@/types';
import { useEffect, useRef } from 'react';

interface WellProps extends CommonProps {
    children?: React.ReactNode;
}

function Well({
    className,
    style,
    children,
}: WellProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (event) => {
            if (containerRef.current?.contains(event.target)) {
                
            }
            else {
                
            }
        }

        document.addEventListener('click', handleClick);
        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [])

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

export default Well;