import { useEffect, useRef, useState } from 'react';
import { Modal } from '@/features/modal';
import { Align, Column, Flex, Row } from 'components/layout';
import Button from '@/components/atoms/Button';
import { ModalHeader } from '@/features/modal';
import classNames from 'classnames';

import useModalDisappear from 'hooks/useModalDisappear';
import { ButtonForm } from '@/components/FormFields';
import { ProfileNameLayout } from './layout';
import { DeleteConfirmDialog } from '@/modals/Dialog';
import useHotkey from '@/hooks/useHotkey';
import { useModal, useModalInstance } from '@/features/modal';

interface EditProfileModalProps {
    name: string;
    onRename: (name: string) => void;
    onDelete: () => Promise<void>;
}

function EditProfileModal({
    name,
    onRename,
    onDelete,
}: EditProfileModalProps) {
    const modal = useModal();
    const { closeModal } = useModalInstance();
    const [renamed, setRenamed] = useState(name);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <Modal
            header={{
                label: '프로필 편집',
                showCloseButton: true,
            }}
            allowEscapeKey={true}
        >
            <div style={{ height: '16px' }} />
            <ProfileNameLayout
                style={{
                    padding: '0 12px',
                }}
                value={renamed}
                onChange={setRenamed}
            />
            <div style={{ height: '0.5em' }} />
            <ButtonForm
                style={{ padding: '0 12px', }}

                buttonClassName={classNames('red')}
                name='프로필 삭제'
                text='삭제'
                onClick={() => {
                    modal.open(<DeleteConfirmDialog onDelete={async () => {
                        await onDelete();
                        closeModal();
                        return true;
                    }} />);
                }}
            />
            <Row
                rowAlign={Align.End}
                style={{
                    width: '100%',
                    height: '32px',
                    gap: '12px',
                }}
            >
                <Button
                    style={{
                        width: '128px',
                        height: '100%'
                    }}
                    onClick={() => {
                        if (renamed !== '' && name !== renamed) {
                            onRename(renamed);
                        }

                        closeModal();
                    }}
                >수정</Button>
                <Button
                    className='transparent'
                    style={{
                        width: '128px',
                        height: '100%'
                    }}
                    onClick={() => closeModal()}
                >취소</Button>
            </Row>
        </Modal>
    )
}

export default EditProfileModal;