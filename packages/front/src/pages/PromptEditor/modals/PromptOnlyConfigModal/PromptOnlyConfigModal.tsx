import { Modal } from '@/features/modal';
import { ButtonForm, StringForm } from '@/components/FormFields';

import { Column, Gap } from '@/components/layout';
import Delimiter from '@/components/atoms/Delimiter';
import ModelForm from '@/components/model-ui';
import SafetySettingConfigModal from './SafetySettingConfigModal';
import DropdownForm, { Dropdown } from '@/components/FormFields/DropdownForm';
import { usePromptOnlyConfigModal } from './PromptOnlyConfigModal.hooks';
import { PromptEditorData } from '../../hooks';
import { useModal } from '@/features/modal';

type PromptOnlyConfigModalProps = {
    promptEditorData: PromptEditorData;
}

export function PromptOnlyConfigModal({
    promptEditorData,
}: PromptOnlyConfigModalProps) {
    const modal = useModal();

    const {
        promptData,
        setModelConfig,
    } = usePromptOnlyConfigModal({
        promptEditorData,
    });

    const { action } = promptEditorData;

    return (
        <Modal
            style={{
                maxHeight: '80%',
            }}
            header={{
                label: '설정',
                showCloseButton: true,
            }}
            allowEscapeKey={true}
        >
            {
                promptData != null &&
                <Column
                    style={{ gap: '0.3em' }}
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
                            modal.open(<SafetySettingConfigModal
                                promptEditorData={promptEditorData}
                            />);
                        }}
                    />
                </Column>
            }
        </Modal>
    )
}