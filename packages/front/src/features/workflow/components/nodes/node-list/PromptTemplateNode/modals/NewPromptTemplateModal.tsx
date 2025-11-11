import { useState } from 'react';
import classNames from 'classnames';

import { Modal, ModalHeader } from '@/components/Modal';
import TreeView, { directory, node, Tree } from '@/components/TreeView';

import { Emit } from '@/lib/zustbus';
import { PromptTemplateEvent } from '../PromptTemplateOption.hooks';
import useModalDisappear from '@/hooks/useModalDisappear';
import { Field } from '@/components/FormFields';
import { Flex, Gap, Row } from '@/components/layout';
import Button from '@/components/atoms/Button';
import ProfileEvent from '@/features/profile-event';

interface NewPromptTemplateModalProps {
    onClose: () => void;
    isFocused: boolean;
    
    emitPromptTemplate: Emit<PromptTemplateEvent>;
}

export function NewPromptTemplateModal({
    onClose = () => { },
    isFocused,

    emitPromptTemplate,
}: NewPromptTemplateModalProps) {
    const [disappear, close] = useModalDisappear(onClose);
    const [name, setName] = useState<string>('새 프롬프트');

    return (
        <Modal
            style={{
                maxWidth: '350px',
            }}
            focused={isFocused}
            onEscapeAction={() => close()}
            disappear={disappear}
            headerLabel={
                <ModalHeader
                    onClose={close}
                >새 프롬프트 템플릿</ModalHeader>
            }
        >
            <Field.String
                name='이름'
                value={name}
                onChange={(v) => setName(v)}
                instantChange={true}
            />
            <Gap h='8px' />
            <Row
                className='wfill'
            >
                <Flex/>
                <Button
                    onClick={async ()=>{
                        

                        // emitPromptTemplate('create_and_navigate_prompt_id', )
                    }}
                >
                    만들기
                </Button>
            </Row>
        </Modal>
    )
}