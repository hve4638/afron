import { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';

import { Align, Column, Row } from '@/components/layout';
import { GIcon, GIconButton } from '@/components/atoms/GoogleFontIcon';
import useModalDisappear from '@/hooks/useModalDisappear';
import { Toast } from '@/types/toast';

import styles from './toast.module.scss';

interface ToastMessageProps {
    value: Toast;
    onClick: () => void;
    onDispose: () => void;
}

export function ToastMessage({ value, onClick, onDispose }: ToastMessageProps) {
    const [disappear, close] = useModalDisappear(onDispose);
    const icon = useMemo(()=>{
        switch (value.type) {
            case 'fatal':
                return 'logo_dev';
            case 'error':
                return 'error';
            case 'info':
                return 'info';
            case 'warn':
                return 'warning';
            case 'success':
                return 'check_circle';
        }
    }, [value.type])

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         close();
    //     }, 3000);

    //     return () => clearTimeout(timer);
    // }, []);

    return (
        <Row
            className={classNames(
                styles['toast-message'],
                'undraggable',
                {
                    disappear: disappear,
                    [styles['fatal-toast']] : value.type === 'fatal',
                    [styles['error-toast']] : value.type === 'error',
                    [styles['info-toast']] : value.type === 'info',
                    [styles['warn-toast']] : value.type === 'warn',
                },
            )}
            columnAlign={Align.Center}
            onClick={(e) => {
                onClick();
                close();
                e.stopPropagation();
            }}
        >
            <GIcon style={{ fontSize: '1.5em' }} value={icon} />
            <Column>
                <span style={{ width: '100%' }}>{value.title}</span>
                <small className={styles['description']}>{value.description}</small>
            </Column>

            <GIconButton
                className={styles['close-button']}
                value='close'
                onClick={(e) => {
                    close();
                    e.stopPropagation();
                }}
            />
        </Row>
    )
}
