import { Modal, ModalHeader } from '@/components/modal';

import { Emit } from '@/lib/zustbus';
import useModalDisappear from '@/hooks/useModalDisappear';
import { Field } from '@/components/FormFields';
import { Flex, Gap, Row } from '@/components/layout';
import { Button } from '@/components/atoms';
import { PromptTemplateEvent } from '../../PromptTemplateNodeOption.hooks';
import { useNewPromptTemplateModal } from './NewPromptTemplateModal.hooks';

interface NewPromptTemplateModalProps {
    onClose: () => void;
    isFocused: boolean;

    rtId: string;
    emitPromptTemplate: Emit<PromptTemplateEvent>;
}

export function NewPromptTemplateModal({
    onClose = () => { },
    isFocused,
    
    rtId,
    emitPromptTemplate,
}: NewPromptTemplateModalProps) {
    const [disappear, closeModal] = useModalDisappear(onClose);
    
    const {
        states: {
            name,
            promptId,
        },
        actions: {
            setName,
            clickCreateButton,
        },
    } = useNewPromptTemplateModal({ rtId, emitPromptTemplate });

    return (
        <Modal
            focused={isFocused}
            disappear={disappear}
            style={{ maxWidth: '350px' }}
            onEscapeAction={closeModal}
            headerLabel={
                <ModalHeader
                    onClose={closeModal}
                >새 프롬프트 템플릿</ModalHeader>
            }
        >
            <Field.String
                name='이름'
                value={name}
                onChange={setName}
                instantChange={true}
            />
            <Gap h='8px' />
            <Row className='wfill'>
                <Flex />
                <Button
                    onClick={clickCreateButton}
                    disabled={promptId == null}
                >만들기</Button>
            </Row>
        </Modal>
    )
}