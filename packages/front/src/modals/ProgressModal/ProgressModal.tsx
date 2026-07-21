import { Modal } from '@/features/modal';
import { progressModalBus } from './events';
import { useOn } from '@/lib/zustbus';
import { Align, Gap, Row } from '@/components/layout';
import Button from '@/components/atoms/Button';
import { useState } from 'react';
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

    useOn(progressModalBus.on.title, ({ id, value }) => {
        if (id !== modalId) return;

        setCurrentTitle(value);
    }, [modalId]);

    useOn(progressModalBus.on.description, ({ id, value }) => {
        if (id !== modalId) return;

        setCurrentDescription(value);
    }, [modalId]);

    useOn(progressModalBus.on.close, ({ id }) => {
        if (id !== modalId) return;

        closeModal();
    }, [modalId]);

    useOn(progressModalBus.on.show_close_button, ({ id }) => {
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
                        onClick={closeModal}
                    >닫기</Button>
                </Row>
            }
        </Modal>
    )
}

export default ProgressModal;