import { useTranslation } from 'react-i18next';

import useModalDisappear from '@/hooks/useModalDisappear';
import useHotkey from '@/hooks/useHotkey';
import useTrigger from '@/hooks/useTrigger';

import { Modal, ModalHeader } from '@/components/Modal';
import Subdescription from '@/components/ui/Description';
import { Column, Row } from '@/components/layout';
import ModelForm from '@/components/model-ui';

import { PromptEditorData } from '@/types';
import { ModelConfiguration } from '@afron/types';

type SafetySettingConfigModalProps = {
    data: PromptEditorData;

    isFocused: boolean;
    onRefresh: () => void;
    onClose: () => void;
}

function SafetySettingConfigModal({
    data,
    onRefresh,

    isFocused,
    onClose
}: SafetySettingConfigModalProps) {
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
            headerLabel={
                <ModalHeader onClose={close}>
                    안전 필터 Gemini
                </ModalHeader>
            }
            style={{
                paddingBottom: '0',
            }}
        >
            <Column
                style={{
                    gap: '0.3em',
                }}
            >
                <Subdescription>
                    <div>Gemini 계열 모델에 적용되는 안전 필터입니다</div>
                    <div>LOW 시 가장 높은 검열이 적용되며, OFF는 안전 필터가 적용되지 않습니다</div>
                </Subdescription>
                <ModelForm.SafetyFilter
                    value={data.model.safety_settings!}
                    onChange={(next) => changeModelConfig('safety_settings', { ...data.model.safety_settings, ...next })}
                />
            </Column>
        </Modal>
    )
}

export default SafetySettingConfigModal;