import React from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';
import { CommonProps } from '@/types';
import { useModalInstance } from '@/features/modal';

export interface ModalBackgroundProps extends CommonProps {
    children?: React.ReactNode;

    enableRoundedBackground?: boolean;
}

function ModalBackground({
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

export default ModalBackground;