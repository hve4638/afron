import React from 'react';
import classNames from 'classnames';
import { CommonProps } from '@/types';
import styles from './styles.module.scss';


interface SubdescriptionProps extends CommonProps {
    children?: React.ReactNode;
}

function Subdescription({
    className = '',
    style = {},
    children
}: SubdescriptionProps) {
    return (
        <div
            className={
                classNames(
                    styles['subdescription'],
                    className
                )
            }
            style={{
                ...style,
            }}
        >
            {children}
        </div>
    );
}

export default Subdescription;