import { SetStateAction } from 'react';
import { GeminiSafetySetting, ModelConfiguration } from '@afron/types';
import { useTranslation } from 'react-i18next';

import useModalDisappear from '@/hooks/useModalDisappear';
import useHotkey from '@/hooks/useHotkey';
import useTrigger from '@/hooks/useTrigger';

import { Modal, ModalHeader } from '@/components/Modal';
import Subdescription from '@/components/atoms/Description';
import { Column, Row } from '@/components/layout';
import ModelForm from '@/components/model-ui';

import { PromptDataPO } from './types';
import { useSafetySettingConfigModal } from './SafetySettingConfigModal.hooks';
import { PromptEditorData } from '../../hooks';

type SafetySettingConfigModalProps = {
    promptEditorData: PromptEditorData;

    isFocused: boolean;
    onClose: () => void;
}

function SafetySettingConfigModal({
    promptEditorData,
    isFocused,
    onClose
}: SafetySettingConfigModalProps) {
    const { t } = useTranslation();
    const [disappear, closeModal] = useModalDisappear(onClose);

    const {
        safetySetting,
        setGeminiSafetyFilter,
    } = useSafetySettingConfigModal({
        promptEditorData,
        focused: isFocused,
        closeModal,
    });

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
                {
                    safetySetting != null &&
                    <ModelForm.SafetyFilter
                        value={safetySetting}
                        onChange={(key, threshold) => setGeminiSafetyFilter(key, threshold)}
                    />
                }
            </Column>:width
        </Modal>
    )
}

export default SafetySettingConfigModal;