import { useState } from 'react';
import classNames from 'classnames';
import { Modal, useModalInstance } from '@/features/modal';
import { ConfirmCancelButtons } from 'components/ModalButtons';

type StringInputModalProps = {
    title: string;
    aboveDescription?: string;
    belowDescription?: string;
    placeholder?: string;
    onSubmit?: (value: string) => Promise<boolean> | boolean | undefined | void;
}

function StringInputModal({
    title,
    aboveDescription,
    belowDescription,
    placeholder,
    onSubmit = () => { return; },
}: StringInputModalProps) {
    const { closeModal } = useModalInstance();
    const [text, setText] = useState<string>('');

    return (
        <Modal
            className='relative'
            style={{
                width: 'auto',
                minWidth: '400px',
            }}
            header={{
                label: title,
                showCloseButton: false,
            }}
            allowEscapeKey={false}
        >
            <div style={{ height: '1em' }} />
            <div className={classNames('undraggable')}>
                {
                    aboveDescription?.split('\n').map((line, index) => (
                        <div key={index}>{line}</div>
                    ))
                }
            </div>
            <input
                className='input-number'
                type='text'
                value={text}
                style={{
                    width: '100%',
                }}
                placeholder={placeholder}
                onChange={(e) => setText(e.target.value)}
            />
            <div className={classNames('undraggable')}>
                {
                    belowDescription?.split('\n').map((line, index) => (
                        <div key={index}>{line}</div>
                    ))
                }
            </div>
            <div style={{ height: '0.5em' }} />
            <ConfirmCancelButtons
                onConfirm={async () => {
                    let result = onSubmit(text);
                    if (result == undefined) closeModal();

                    if (result && typeof result['then'] === 'function') {
                        result = await result;
                    }
                    if (result || result == undefined) {
                        closeModal();
                    }
                }}
                onCancel={() => closeModal()}
                enableConfirmButton={text.length > 0}
            />
        </Modal>
    )
}

export default StringInputModal;