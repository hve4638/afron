import { Modal, ModalHeader } from '@/components/modal';
import Subdescription from '@/components/atoms/Description';
import { Column, Row } from '@/components/layout';
import ModelForm from '@/components/model-ui';

import { useSafetySettingConfigModal } from './SafetySettingConfigModal.hooks';
import { PromptEditorData } from '../../hooks';

type SafetySettingConfigModalProps = {
    promptEditorData: PromptEditorData;
}

function SafetySettingConfigModal({
    promptEditorData,
}: SafetySettingConfigModalProps) {

    const {
        safetySetting,
        setGeminiSafetyFilter,
    } = useSafetySettingConfigModal({
        promptEditorData,
    });

    return (
        <Modal
            style={{
                paddingBottom: '0',
            }}
            header={{
                label: '안전 필터 Gemini',
                showCloseButton: true,
            }}
            allowEscapeKey={true}
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