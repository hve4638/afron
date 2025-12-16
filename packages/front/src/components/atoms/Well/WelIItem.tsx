import classNames from 'classnames';

import { ReactNodeProps } from '@/types';

import styles from './WellItem.module.scss';

interface WellItemProps extends ReactNodeProps.Common, ReactNodeProps.MouseAction<HTMLDivElement> {
    children?: React.ReactNode;

    onClick?: () => void;
    selected?: boolean;

    hoverable?: boolean;
}

export function WellItem({
    className,
    style,
    children,

    onClick,
    onDoubleClick,
    onMouseDown,
    onMouseEnter,
    onMouseLeave,
    onMouseMove,

    selected = false,
    hoverable = false,
}: WellItemProps) {
    const divProps = {
        onClick,
        onDoubleClick,
        onMouseDown,
        onMouseEnter,
        onMouseLeave,
        onMouseMove,
    }
    return (
        <div
            className={
                classNames(
                    styles['well-item'],
                    { hoverable, selected },
                    className,
                )
            }
            style={style}
            {...divProps}
        >
            {children}
        </div>
    );
}