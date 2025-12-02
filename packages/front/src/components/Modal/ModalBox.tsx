import React from 'react';
import classNames from 'classnames';

import styles from './style.module.scss';
import { CommonProps } from '@/types';
import { useModalInstance } from '@/features/modal';

interface ModalDivProps extends CommonProps {
    children?: React.ReactNode;
}

function ModalBox({
    children,
    className = '',
    style = {},
}: ModalDivProps) {
    const { disappear } = useModalInstance();

    return (
        <div
            className={
                classNames(
                    styles['modal'],
                    className,
                    { [styles['disappear']]: disappear },
                )
            }
            style={{
                borderRadius: '5px',
                ...style,
            }}
        >
            {children}
        </div>
    );
}

export default ModalBox;