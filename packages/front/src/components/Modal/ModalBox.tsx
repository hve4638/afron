import React from 'react';
import classNames from 'classnames';

import styles from './style.module.scss';
import { CommonProps } from '@/types';

interface ModalDivProps extends CommonProps {
    children?: React.ReactNode;
    disappear?: boolean,
}

function ModalBox({
    children,
    className='',
    style={},

    disappear=false,
}: ModalDivProps) {
    return (
        <div
            className={
                classNames(
                    styles['modal'],
                    className,
                    { [styles['disappear']] : disappear },
                )
            }
            style={{
                borderRadius: '5px',
                ...style,
            }}
        >
            {
                children != null &&
                children
            }
        </div>
    );
}

export default ModalBox;