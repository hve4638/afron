import { Modal } from '@/features/modal';

import { Emit } from '@/lib/zustbus';
import { Field } from '@/components/FormFields';
import { Flex, Gap, Row } from '@/components/layout';
import { Button } from '@/components/atoms';
import { PromptTemplateEvent } from '../../PromptTemplateNodeOption.hooks';
import { useNewPromptTemplateModal } from './NewPromptTemplateModal.hooks';

interface NewPromptTemplateModalProps {
    rtId: string;
    emitPromptTemplate: Emit<PromptTemplateEvent>;
}

export function NewPromptTemplateModal({
    rtId,
    emitPromptTemplate,
}: NewPromptTemplateModalProps) {
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
            style={{ maxWidth: '350px' }}
            header={{
                label: '새 프롬프트 템플릿 만들기',
                showCloseButton: true,
            }}
            allowEscapeKey={true}
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