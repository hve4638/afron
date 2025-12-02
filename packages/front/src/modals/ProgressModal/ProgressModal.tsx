import { Modal, ModalHeader, ModalRequiredProps } from '@/components/modal';
import { useProgressModalEvent } from './events';
import { Align, Gap, Row } from '@/components/layout';
import Button from '@/components/atoms/Button';
import { useState } from 'react';
import useHotkey from '@/hooks/useHotkey';
import useModalDisappear from '@/hooks/useModalDisappear';
import { useModalInstance } from '@/features/modal';

interface ProgressModalProps {
    modalId: string;

    title?: string;
    description?: string;
    progress?: number;
}

function ProgressModal({
    modalId,

    title,
    description,
    progress
}: ProgressModalProps) {
    const { closeModal } = useModalInstance();
    const [currentTitle, setCurrentTitle] = useState(title ?? null);
    const [currentDescription, setCurrentDescription] = useState(description ?? null);
    const [closeInteractionEnabled, setCloseInteractionEnabled] = useState(false);

    useProgressModalEvent('title', ({ id, value }) => {
        if (id !== modalId) return;

        setCurrentTitle(value);
    }, [modalId]);

    useProgressModalEvent('description', ({ id, value }) => {
        if (id !== modalId) return;

        setCurrentDescription(value);
    }, [modalId]);

    useProgressModalEvent('close', ({ id }) => {
        if (id !== modalId) return;

        closeModal();
    }, [modalId]);

    useProgressModalEvent('show_close_button', ({ id }) => {
        if (id !== modalId) return;

        setCloseInteractionEnabled(true);
    }, [modalId]);

    return (
        <Modal
            style={{
                minWidth: '15em',
                width: 'auto',
            }}
            header={{
                label: 'title',
                showCloseButton: false,
            }}
            allowEscapeKey={closeInteractionEnabled}
        >
            <div>{currentDescription}</div>
            {
                closeInteractionEnabled &&
                <Row
                    style={{ marginTop: '0.5em' }}
                    rowAlign={Align.End}
                >
                    <Button
                        style={{ minWidth: '5em' }}
                        onClick={() => {
                            close();
                        }}
                    >닫기</Button>
                </Row>
            }
        </Modal>
    )
}

export default ProgressModal;