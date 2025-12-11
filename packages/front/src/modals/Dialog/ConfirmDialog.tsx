import classNames from 'classnames';

import { Align, Row } from '@/components/layout';
import { Modal, ModalHeader, useModalInstance } from '@/features/modal';
import Button from '@/components/atoms/Button';

import { CommonDialogProps } from './types';

interface ConfirmDialogProps extends CommonDialogProps {
    confirmText?:string;
    cancelText?:string;
    onConfirm?:()=>boolean;
    onCancel?:()=>boolean;
    enableRoundedBackground?:boolean

    confirmButtonClassName?:string,
    cancelButtonClassName?:string,
}

function ConfirmDialog({
    title,
    children,
    confirmText = '확인',
    cancelText = '취소',
    onConfirm = ()=>true,
    onCancel = ()=>true,
    confirmButtonClassName='',
    cancelButtonClassName='',

    enableRoundedBackground = false,

    className='',
    style={},
}:ConfirmDialogProps) {
    const { closeModal } = useModalInstance();

    return (
        <Modal
            className={className}
            style={style}
            header={{
                label: title,
                showCloseButton: false,
            }}
            allowEscapeKey={false}
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
            {
                children != null &&
                children
            }
            </div>
            <Row
                rowAlign={Align.End}
                style={{
                    gap : '6px',
                }}
            >
                <Button
                    className={classNames(confirmButtonClassName)}
                    style={{ minWidth: '6em' }}
                    onClick={()=>{
                        if (onConfirm()) {
                            closeModal();
                        }
                    }}
                >{confirmText}</Button>
                <Button
                    className={classNames(cancelButtonClassName, 'transparent')}
                    style={{ minWidth: '6em' }}
                    onClick={()=>{
                        if (onCancel()) {
                            closeModal();
                        }
                    }}
                >{cancelText}</Button>
            </Row>
        </Modal>
    )
}

export default ConfirmDialog;