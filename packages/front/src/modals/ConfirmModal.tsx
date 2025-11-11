import { useEffect, useState } from 'react';
import classNames from 'classnames';

import { Button } from '@/components/atoms';
import { Align, Row } from '@/components/layout';
import { Modal } from '@/components/modal';

import { MODAL_DISAPPEAR_DURATION_MS } from '@/constants';
import useModalDisappear from '@/hooks/useModalDisappear';

interface ConfirmModalProps {
    title?: string;
    children?: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => boolean;
    onCancel?: () => boolean;
    onClosed: () => void;
    enableRoundedBackground?: boolean

    className?: string;
    style?: React.CSSProperties;
    confirmButtonClassName?: string,
    cancelButtonClassName?: string,
}

function ConfirmModal({
    title,
    children,
    confirmText = '확인',
    cancelText = '취소',
    onConfirm = () => true,
    onCancel = () => true,
    onClosed,
    confirmButtonClassName = '',
    cancelButtonClassName = '',

    enableRoundedBackground = false,

    className = '',
    style = {},
}: ConfirmModalProps) {
    const [disappear, closeModal] = useModalDisappear(onClosed);

    return (
        <Modal
            className={className}
            style={style}
            disappear={disappear}
            enableRoundedBackground={enableRoundedBackground}
        >
            {
                title != null &&
                <h2>{title}</h2>
            }
            <div
                className='undraggable'
                style={{
                    fontSize: '0.9em',
                    padding: '4px 0.5em 1em 0.5em',
                    display: 'block'
                }}
            >
                {
                    children != null &&
                    children
                }
            </div>
            <Row
                rowAlign={Align.End}
            >
                <Button
                    className={
                        classNames(
                            confirmButtonClassName,
                        )
                    }
                    style={{
                        width: '90px'
                    }}
                    onClick={() => {
                        if (onConfirm()) {
                            closeModal();
                        }
                    }}
                >{confirmText}</Button>
                <Button
                    className={
                        classNames(
                            cancelButtonClassName,
                        )
                    }
                    style={{
                        width: '90px',
                        marginLeft: '6px',
                    }}
                    onClick={() => {
                        if (onCancel()) {
                            closeModal();
                        }
                    }}
                >{cancelText}</Button>
            </Row>
        </Modal>
    )
}

export default ConfirmModal;