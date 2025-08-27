import { Modal, ModalHeader, ModalRequiredProps } from '@/components/Modal';
import { useProgressModalEvent } from './events';
import { Align, Gap, Row } from '@/components/layout';
import Button from '@/components/Button';
import { useState } from 'react';

interface ProgressModalProps extends ModalRequiredProps {
    modalId: string;

    title?: string;
    description?: string;
    progress?: number;
}

function ProgressModal({
    onClose,
    modalId,

    title,
    description,
    progress
}: ProgressModalProps) {
    const [currentTitle, setCurrentTitle] = useState(title ?? null);
    const [currentDescription, setCurrentDescription] = useState(description ?? null);

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

        onClose();
    }, [modalId]);

    return (
        <Modal
            style={{
                // maxWidth: undefined,
                minWidth: '15em',
                width: 'auto',
            }}
            headerLabel={
                currentTitle != null &&
                <ModalHeader hideCloseButton>
                    {title}
                </ModalHeader>
            }
        >
            <div>{currentDescription}</div>
            {/* <Row rowAlign={Align.End}>
                <Button style={{ minWidth: '5em' }}>닫기</Button>
            </Row> */}
        </Modal>
    )
}

export default ProgressModal;