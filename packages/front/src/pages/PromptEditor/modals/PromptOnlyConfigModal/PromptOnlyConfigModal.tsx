import { SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ModalHeader } from '@/components/Modal';
import { ButtonForm, StringForm } from '@/components/forms';

import { Column, Gap, Row } from '@/components/layout';
import useModalDisappear from '@/hooks/useModalDisappear';
import Delimiter from '@/components/Delimiter';
import ModelForm from '@/components/model-ui';
import { useModal } from '@/hooks/useModal';
import SafetySettingConfigModal from './SafetySettingConfigModal';
import DropdownForm, { Dropdown } from '@/components/forms/DropdownForm';
import { usePromptOnlyConfigModal } from './PromptOnlyConfigModal.hooks';
import { PromptEditorData } from '../../hooks';

type PromptOnlyConfigModalProps = {
    promptEditorData: PromptEditorData;

    isFocused: boolean;
    onClose: () => void;
}

export function PromptOnlyConfigModal({
    promptEditorData,

    isFocused,
    onClose
}: PromptOnlyConfigModalProps) {
    const modal = useModal();
    const { t } = useTranslation();
    const [disappear, closeModal] = useModalDisappear(onClose);

    const {
        promptData,
        setModelConfig,
    } = usePromptOnlyConfigModal({
        promptEditorData,
        focused: isFocused,
        closeModal,
    });

    const { action } = promptEditorData;

    return (
        <Modal
            disappear={disappear}
            style={{
                maxHeight: '80%',
            }}
            headerLabel={
                <ModalHeader onClose={closeModal}>설정</ModalHeader>
            }
        >
            {
                promptData != null &&
                <Column
                    style={{
                        gap: '0.3em',
                    }}
                >
                    <b className='undraggable'>메타데이터</b>
                    <Delimiter />
                    <StringForm
                        name='템플릿 이름'
                        value={promptData.name ?? ''}
                        onChange={(value) => {
                            action.setName(value);
                        }}
                    />
                    <StringForm
                        name='버전'
                        value={promptData.version}
                        onChange={(value) => {
                            action.setVersion(value);
                        }}
                    />
                    <Gap h='0.5em' />
                    <b className='undraggable'>입력</b>
                    <Delimiter />
                    <DropdownForm
                        label='입력 레이아웃'
                        value={promptData.promptOnly.inputType}
                        onChange={(next) => action.setInputType(next)}
                    >
                        <Dropdown.Item name='일반' value='normal' />
                        <Dropdown.Item name='채팅' value='chat' />
                    </DropdownForm>
                    <div style={{ height: '0.5em' }} />
                    <b className='undraggable'>모델</b>
                    <Delimiter />
                    <ModelForm.MaxToken
                        value={promptData.promptOnly.model.max_tokens}
                        onChange={(value) => setModelConfig('max_tokens', value ?? 0)}
                    />
                    <ModelForm.Temperature
                        value={promptData.promptOnly.model.temperature}
                        onChange={(value) => setModelConfig('temperature', value ?? 0)}
                        allowEmpty={true}
                    />
                    <ModelForm.TopP
                        value={promptData.promptOnly.model.top_p}
                        onChange={(value) => setModelConfig('top_p', value ?? 0)}
                        allowEmpty={true}
                    />
                    <div style={{ height: '1em' }} />

                    <ModelForm.ThinkingEnabled
                        value={promptData.promptOnly.model.use_thinking ?? false}
                        onChange={(checked) => setModelConfig('use_thinking', checked)}
                    />
                    <ModelForm.ThinkingTokens
                        value={promptData.promptOnly.model.thinking_tokens}
                        onChange={(checked) => setModelConfig('thinking_tokens', checked ?? 0)}
                    />
                    <ModelForm.ReasoningEffort
                        value={promptData.promptOnly.model.thinking_effort}
                        onChange={(next) => setModelConfig('thinking_effort', next)}
                    />
                    <ModelForm.Verbosity
                        value={promptData.promptOnly.model.verbosity}
                        onChange={(next) => setModelConfig('verbosity', next)}
                    />

                    <div style={{ height: '1em' }} />
                    <ButtonForm
                        name='Gemini 안전 필터'
                        text='설정 열기'
                        style={{
                            width: '100%',
                        }}
                        onClick={() => {
                            modal.open(SafetySettingConfigModal, {
                                promptEditorData,
                            });
                        }}
                    />

                    {/* <div style={{ height:'0.5em' }}/>
                <NumberForm
                    name='이전 대화 컨텍스트 크기'
                    value={0}
                    onChange={(value)=>{
                        console.log(value);
                        refresh();
                    }}
                /> */}
                </Column>
            }
            {/* <hr/>
            <b>모델 제한</b>
            <div>제한 없음</div>
            <div>프로바이더 제한</div>
            <div>특정 모델만</div>
             */}
        </Modal>
    )
}