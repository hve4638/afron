import { ButtonForm, StringForm, StringLongForm } from '@/components/FormFields';
import { Modal, ModalHeader } from '@/components/modal';
import { ConfirmCancelButtons } from '@/components/ModalButtons';
import { useModal } from '@/hooks/useModal';
import useModalDisappear from '@/hooks/useModalDisappear';
import { useState } from 'react';
import SelectAuthKeyModal from './SelectAuthKeyModal';
import useHotkey from '@/hooks/useHotkey';
import { DeleteConfirmDialog } from '@/modals/Dialog';
import { GIconButton } from '@/components/atoms/GoogleFontIcon';
import DropdownForm, { Dropdown } from '@/components/FormFields/DropdownForm';
import { CustomModelCreate } from '@afron/types';

interface EditCustomModelModalProps {
    value?: CustomModelCreate;
    onConfirm?: (value: CustomModelCreate) => Promise<boolean | void>;
    onDelete?: (customId: string) => Promise<boolean | void>;
    onClose?: () => void;
    isFocused?: boolean;
}

function EditCustomModelModal({
    value = {
        name: '',
        model: '',
        url: '',
        api_format: 'chat_completions',
        thinking: false,
        secret_key: '',
    },
    onConfirm = async () => { },
    onClose = () => { },
    onDelete = async () => { },
    isFocused = true,
}: EditCustomModelModalProps) {
    const modal = useModal();
    const [disappear, close] = useModalDisappear(onClose);
    const [name, setName] = useState(value.name);
    const [model, setModel] = useState(value.model);
    const [url, setURL] = useState(value.url);
    const [requestFormat, setRequestFormat] = useState(value.api_format);
    const [authSecretKey, setAuthSecretKey] = useState<string>(value.secret_key ?? '');
    const [thinking, setThinking] = useState(value.thinking);

    useHotkey({
        'Escape': () => {
            close();
        },
    }, isFocused);

    return (
        <Modal
            className='relative'
            disappear={disappear}
            style={{
                width: 'auto',
                minWidth: '400px',
            }}
        >
            <ModalHeader
                buttonRenderer={() => (
                    value.id != undefined
                        ? (
                            <GIconButton
                                value='delete'
                                hoverEffect='square'
                                onClick={() => {
                                    modal.open(DeleteConfirmDialog, {
                                        onDelete: async () => {
                                            await onDelete(value.id!);
                                            close();
                                            return true;
                                        },
                                    });
                                }}
                            />
                        )
                        : <></>
                )}
            >커스텀 모델</ModalHeader>
            <div style={{ height: '0.25em' }} />
            <StringForm
                name='이름'
                value={name}
                onChange={(value) => setName(value)}
                instantChange={true}
            />
            <div style={{ height: '0.5em' }} />
            <StringForm
                name='모델'
                value={model}
                onChange={(value) => setModel(value)}
                instantChange={true}
            />
            <div style={{ height: '0.5em' }} />
            <StringLongForm
                name='URL'
                value={url}
                onChange={(value) => setURL(value)}
                instantChange={true}
            />
            <div style={{ height: '0.75em' }} />
            <DropdownForm
                label='요청 형식'
                value={requestFormat}
                onChange={(next) => setRequestFormat(next as 'chat_completions')}
                onItemNotFound={(first) => {
                    if (first != null) {
                        setRequestFormat('chat_completions');
                    }
                }}
            >
                <Dropdown.Item name='Chat Completions' value='chat_completions' />
                <Dropdown.Item name='Anthropic Claude' value='anthropic_claude' />
                <Dropdown.Item name='Google Generative Language' value='generative_language' />
            </DropdownForm>
            <div style={{ height: '0.25em' }} />
            {/* <CheckBoxForm
                name='추론 모델 여부'
                checked={thinking}
                onChange={(value) => setThinking(value)}
            /> */}
            <ButtonForm
                name='API 키'
                text='변경'
                onClick={() => {
                    modal.open(SelectAuthKeyModal, {
                        value: authSecretKey,
                        onChange: (value) => setAuthSecretKey(value),
                    });
                }}
            />
            <div style={{ height: '0.5em' }} />
            <ConfirmCancelButtons
                onConfirm={async () => {
                    const next = {
                        id: value.id,
                        name,
                        model,
                        url,
                        api_format: requestFormat,
                        thinking: thinking,
                        secret_key: authSecretKey,
                    };
                    const result = await onConfirm(next);

                    if (result ?? true) close();
                }}
                onCancel={() => close()}
                enableConfirmButton={model !== '' && url !== '' && name !== ''}
            />
        </Modal>
    )
}

export default EditCustomModelModal;