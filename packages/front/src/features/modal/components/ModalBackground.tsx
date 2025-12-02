import React from 'react';
import classNames from 'classnames';
import { CommonProps } from '@/types';

import styles from './ModalBackground.module.scss';
export interface ModalBackgroundProps extends CommonProps {
    children?: React.ReactNode;

    disappear?: boolean;
    enableRoundedBackground?: boolean;
}

export function ModalBackground({
    className = '',
    style = {},
    children,

    disappear = false,
    enableRoundedBackground = false,
}: ModalBackgroundProps) {

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
            {
                children != null &&
                children
            }
        </div>
    );
}