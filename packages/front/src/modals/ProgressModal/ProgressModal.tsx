import { Modal, ModalHeader, ModalRequiredProps } from '@/components/modal';
import { useProgressModalEvent } from './events';
import { Align, Gap, Row } from '@/components/layout';
import Button from '@/components/atoms/Button';
import { useState } from 'react';
import useHotkey from '@/hooks/useHotkey';
import useModalDisappear from '@/hooks/useModalDisappear';

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
    const [disappear, close] = useModalDisappear(onClose);
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

        onClose();
    }, [modalId]);

    useProgressModalEvent('show_close_button', ({ id }) => {
        if (id !== modalId) return;

        setCloseInteractionEnabled(true);
    }, [modalId]);

    useHotkey({
        'Escape': () => {
            close();
        }
    }, closeInteractionEnabled, []);

    return (
        <Modal
            disappear={disappear}
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