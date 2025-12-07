import { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, ModalHeader } from '@/features/modal';
import { ConfirmCancelButtons } from 'components/ModalButtons';
import { StringForm, StringLongForm } from '@/components/FormFields';
import { useModalInstance } from '@/features/modal';

type StringInputModalProps = {
    title: string;
    apiKeyName?: string;
    editMode?: boolean;

    memo?: string;

    onSubmit?: (x: { authKey: string; memo: string; }) => Promise<boolean> | boolean | undefined | void;
}

function AddAPIKeyModal({
    title,
    apiKeyName,
    editMode = false,
    memo = '',
    onSubmit = () => { return; },
}: StringInputModalProps) {
    const { closeModal } = useModalInstance();
    const [authKey, setAuthKey] = useState<string>('');
    const [currentMemo, setCurrentMemo] = useState<string>(memo);

    return (
        <Modal
            className='relative'
            style={{
                width: 'auto',
                minWidth: '400px',
            }}
            allowEscapeKey={true}
        >
            <ModalHeader hideCloseButton={true}>{title}</ModalHeader>
            <div style={{ height: '0.5em' }} />
            <StringLongForm
                name={apiKeyName ?? 'API Key'}
                value={authKey}
                onChange={(value) => setAuthKey(value)}
                instantChange={true}
                placeholder={editMode ? '변경 없음' : ''}
            />
            <div style={{ height: '0.25em' }} />
            <StringLongForm
                name='메모'
                value={currentMemo}
                onChange={(value) => setCurrentMemo(value)}
                instantChange={true}
            />
            <div style={{ height: '1em' }} />
            <ConfirmCancelButtons
                onConfirm={async () => {
                    let result = onSubmit({ authKey, memo: currentMemo });
                    if (result == undefined) closeModal();

                    if (result && typeof result['then'] === 'function') {
                        result = await result;
                    }
                    if (result || result == undefined) {
                        closeModal();
                    }
                }}
                onCancel={() => closeModal()}
                enableConfirmButton={authKey.length > 0 || editMode}
            />
        </Modal>
    )
}

export default AddAPIKeyModal;