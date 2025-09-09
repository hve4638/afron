import { useTranslation } from 'react-i18next';
import { Modal, ModalHeader } from '@/components/Modal';
import { ButtonForm, StringForm } from '@/components/forms';

import useTrigger from '@/hooks/useTrigger';
import styles from './styles.module.scss';
import { Column, Row } from '@/components/layout';
import useModalDisappear from '@/hooks/useModalDisappear';
import useHotkey from '@/hooks/useHotkey';
import { PromptEditorData, PromptInputType } from '@/types';
import { use } from 'i18next';
import Delimiter from '@/components/Delimiter';
import CheckBox from '@/components/CheckBox';
import ModelForm from '@/components/model-ui';
import { useModal } from '@/hooks/useModal';
import SafetySettingConfigModal from './SafetySettingConfigModal';
import Subdescription from '@/components/ui/Description';
import DropdownForm, { Dropdown } from '@/components/forms/DropdownForm';

type PromptOnlyConfigModalProps = {
    data: PromptEditorData;
    onRefresh?: () => void;

    isFocused: boolean;
    onClose: () => void;
}

function PromptOnlyConfigModal({
    data,
    onRefresh = () => { },
    isFocused,
    onClose
}: PromptOnlyConfigModalProps) {
    const modal = useModal();
    const { t } = useTranslation();
    const [disappear, close] = useModalDisappear(onClose);
    const [_, refreshSignal] = useTrigger();

    const refresh = () => {
        data.changed.config = true;
        refreshSignal();
        onRefresh();
    }

    const changeModelConfig = <T extends keyof ModelConfiguration,>(key: T, value: ModelConfiguration[T]) => {
        data.model[key] = value;
        data.changed.model = true;
        refresh();
    }

    useHotkey({
        'Escape': () => {
            close();
            return true;
        }
    }, isFocused);

    return (
        <Modal
            disappear={disappear}
            style={{
                maxHeight: '80%',
            }}
            headerLabel={
                <ModalHeader onClose={close}>
                    설정
                </ModalHeader>
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
                        data.name = value;
                        data.changed.name = true;
                        refresh();
                    }}
                />
                <StringForm
                    name='버전'
                    value={data.version}
                    onChange={(value) => {
                        data.version = value;
                        data.changed.version = true;
                        refresh();
                    }}
                />
                <div style={{ height: '0.5em' }} />
                <b className='undraggable'>입력</b>
                <Delimiter />
                <DropdownForm
                    label='입력 레이아웃'
                    value={data.config.inputType}
                    onChange={(next) => {
                        data.config.inputType = next;
                        refresh();
                    }}
                >
                    <Dropdown.Item name='일반' value='normal'/>
                    <Dropdown.Item name='채팅' value='chat'/>
                </DropdownForm>
                <div style={{ height: '0.5em' }} />
                <b className='undraggable'>모델</b>
                <Delimiter />
                <ModelForm.MaxToken
                    value={data.model.max_tokens}
                    onChange={(value) => changeModelConfig('max_tokens', value ?? 0)}
                />
                <ModelForm.Temperature
                    value={data.model.temperature}
                    onChange={(value) => changeModelConfig('temperature', value ?? 0)}
                    allowEmpty={true}
                />
                <ModelForm.TopP
                    value={data.model.top_p}
                    onChange={(value) => changeModelConfig('top_p', value ?? 0)}
                    allowEmpty={true}
                />
                <div style={{ height: '1em' }} />

                <ModelForm.ThinkingEnabled
                    value={data.model.use_thinking ?? false}
                    onChange={(checked) => changeModelConfig('use_thinking', checked)}
                />
                <ModelForm.ThinkingTokens
                    value={data.model.thinking_tokens}
                    onChange={(checked) => changeModelConfig('thinking_tokens', checked ?? 0)}
                />
                <ModelForm.ReasoningEffort
                    value={data.model.thinking_effort}
                    onChange={(next) => changeModelConfig('thinking_effort', next)}
                />
                <ModelForm.Verbosity
                    value={data.model.verbosity}
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
                            data: data,
                            onRefresh: refresh,
                        });
                    }}
                />
                <Row></Row>

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

export default PromptOnlyConfigModal;