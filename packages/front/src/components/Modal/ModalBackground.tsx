import React from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';
import { CommonProps } from '@/types';

export interface ModalBackgroundProps extends CommonProps {
    children?: React.ReactNode;

    disappear?: boolean;
    enableRoundedBackground?: boolean;
}

function ModalBackground({
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

export default ModalBackground;