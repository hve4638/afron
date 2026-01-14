import React from 'react';
import classNames from 'classnames';

import { CommonProps } from '@/types';
import { useModalInstance } from '../context';

import styles from './Modal.module.scss';

interface ModalDivProps extends CommonProps {
    children?: React.ReactNode;
}

export function ModalBox({
    children,
    className='',
    style={},
}: ModalDivProps) {
    const { disappear } = useModalInstance();

    return (
        <div
            className={
                classNames(
                    styles['modal'],
                    { [styles['disappear']]: disappear },
                    className,
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