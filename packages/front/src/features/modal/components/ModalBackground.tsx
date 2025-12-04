import React from 'react';
import classNames from 'classnames';
import { CommonProps } from '@/types';

import styles from './ModalBackground.module.scss';
import { useModalInstance } from '../context';
export interface ModalBackgroundProps extends CommonProps {
    children?: React.ReactNode;

    enableRoundedBackground?: boolean;
}

export function ModalBackground({
    className = '',
    style = {},
    children,

    enableRoundedBackground = false,
}: ModalBackgroundProps) {
    const { disappear } = useModalInstance();

    return (
        <div className={
            classNames(
                styles['modal-background'],
                { disappear, className }
            )}
            style={{
                ...style,
                borderRadius: enableRoundedBackground ? '5px' : '0px',
            }}
        >
            {children}
        </div>
    );
}