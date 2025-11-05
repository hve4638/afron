import { SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ModalHeader } from '@/components/Modal';
import { ButtonForm, StringForm } from '@/components/forms';

import { Column, Gap, Row } from '@/components/layout';
import useModalDisappear from '@/hooks/useModalDisappear';
import { PromptData, PromptInputType } from '@/types';
import Delimiter from '@/components/Delimiter';
import ModelForm from '@/components/model-ui';
import { useModal } from '@/hooks/useModal';
import SafetySettingConfigModal from './SafetySettingConfigModal';
import DropdownForm, { Dropdown } from '@/components/forms/DropdownForm';
import { usePromptOnlyConfigModal } from './PromptOnlyConfigModal.hooks';
import { PromptDataPO } from './types';

type PromptOnlyConfigModalProps = {
    data: Readonly<PromptDataPO>;
    onChange: (data: SetStateAction<PromptDataPO>) => void;

    isFocused: boolean;
    onClose: () => void;
}

export function PromptOnlyConfigModal({
    data,
    onChange,

    isFocused,
    onClose
}: PromptOnlyConfigModalProps) {
    const modal = useModal();
    const { t } = useTranslation();
    const [disappear, closeModal] = useModalDisappear(onClose);

    const {
        setModelConfig: changeModelConfig,
    } = usePromptOnlyConfigModal({
        data,
        onChange,
        focused: isFocused,
        closeModal,
    });

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
            <Column
                style={{
                    gap: '0.3em',
                }}
            >
                <b className='undraggable'>메타데이터</b>
                <Delimiter />
                <StringForm
                    name='템플릿 이름'
                    value={data.name ?? ''}
                    onChange={(value) => {
                        onChange(prev => ({
                            ...prev,
                            name: value,
                            changed: {
                                ...prev.changed,
                                name: true,
                            }
                        }));
                    }}
                />
                <StringForm
                    name='버전'
                    value={data.version}
                    onChange={(value) => {
                        onChange(prev => ({
                            ...prev,
                            version: value,
                            changed: {
                                ...prev.changed,
                                version: true,
                            }
                        }));
                    }}
                />
                <Gap h='0.5em' />
                <b className='undraggable'>입력</b>
                <Delimiter />
                <DropdownForm
                    label='입력 레이아웃'
                    value={data.promptOnly.inputType}
                    onChange={(next) => {
                        onChange(prev => ({
                            ...prev,
                            promptOnly: {
                                ...prev.promptOnly,
                                inputType: next,
                            },
                            changed: {
                                ...prev.changed,
                                inputType: true,
                            }
                        }));
                    }}
                >
                    <Dropdown.Item name='일반' value='normal' />
                    <Dropdown.Item name='채팅' value='chat' />
                </DropdownForm>
                <div style={{ height: '0.5em' }} />
                <b className='undraggable'>모델</b>
                <Delimiter />
                <ModelForm.MaxToken
                    value={data.promptOnly.model.max_tokens}
                    onChange={(value) => changeModelConfig('max_tokens', value ?? 0)}
                />
                <ModelForm.Temperature
                    value={data.promptOnly.model.temperature}
                    onChange={(value) => changeModelConfig('temperature', value ?? 0)}
                    allowEmpty={true}
                />
                <ModelForm.TopP
                    value={data.promptOnly.model.top_p}
                    onChange={(value) => changeModelConfig('top_p', value ?? 0)}
                    allowEmpty={true}
                />
                <div style={{ height: '1em' }} />

                <ModelForm.ThinkingEnabled
                    value={data.promptOnly.model.use_thinking ?? false}
                    onChange={(checked) => changeModelConfig('use_thinking', checked)}
                />
                <ModelForm.ThinkingTokens
                    value={data.promptOnly.model.thinking_tokens}
                    onChange={(checked) => changeModelConfig('thinking_tokens', checked ?? 0)}
                />
                <ModelForm.ReasoningEffort
                    value={data.promptOnly.model.thinking_effort}
                    onChange={(next) => changeModelConfig('thinking_effort', next)}
                />
                <ModelForm.Verbosity
                    value={data.promptOnly.model.verbosity}
                    onChange={(next) => changeModelConfig('verbosity', next)}
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
                            data,
                            onChange,
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

            {/* <hr/>
            <b>모델 제한</b>
            <div>제한 없음</div>
            <div>프로바이더 제한</div>
            <div>특정 모델만</div>
             */}
        </Modal>
    )
}