import classNames from 'classnames';

import { Align, Row } from '@/components/layout';
import { Modal, useModalInstance } from '@/features/modal';
import Button from '@/components/atoms/Button';

import { CommonDialogProps } from './types';

interface InfoDialogProps extends CommonDialogProps {
    buttonText?: string;
    cancelText?: string;
    onConfirm?: () => boolean;
    onCancel?: () => boolean;
    enableRoundedBackground?: boolean

    buttonClassName?: string,
}

function InfoDialog({
    title,
    children,
    buttonText = '확인',
    onConfirm = () => true,
    buttonClassName = '',

    enableRoundedBackground = false,

    className = '',
    style = {},
}: InfoDialogProps) {
    const { closeModal } = useModalInstance();

    return (
        <Modal
            className={className}
            style={style}

            header={{
                label: title,
                showCloseButton: false,
            }}
            backgroundProps={{
                enableRoundedBackground: enableRoundedBackground,
            }}
        >
            <div
                className='undraggable'
                style={{
                    fontSize: '0.9em',
                    padding: '4px 0.5em 1em 0.5em',
                    display: 'block'
                }}
            >
                {children}
            </div>
            <Row
                rowAlign={Align.End}
                style={{
                    gap: '6px',
                }}
            >
                <Button
                    className={classNames(buttonClassName)}
                    style={{ minWidth: '6em' }}
                    onClick={() => {
                        if (onConfirm()) {
                            closeModal();
                        }
                    }}
                >{buttonText}</Button>
            </Row>
        </Modal>
    )
}

export default InfoDialog;