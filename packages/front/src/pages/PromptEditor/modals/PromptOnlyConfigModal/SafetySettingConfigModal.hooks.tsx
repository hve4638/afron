import { SetStateAction } from 'react';
import { GeminiSafetySetting, ModelConfiguration } from '@afron/types';
import { useTranslation } from 'react-i18next';

import useModalDisappear from '@/hooks/useModalDisappear';
import useHotkey from '@/hooks/useHotkey';
import useTrigger from '@/hooks/useTrigger';

import { Modal, ModalHeader } from '@/components/Modal';
import Subdescription from '@/components/ui/Description';
import { Column, Row } from '@/components/layout';
import ModelForm from '@/components/model-ui';

import { PromptDataPO } from './types';

type UseSafetySettingConfigModalProps = {
    data: PromptDataPO;
    onChange: (data: SetStateAction<PromptDataPO>) => void;

    focused: boolean;
    closeModal: () => void;
}

export function useSafetySettingConfigModal({
    data,
    onChange,

    focused,
    closeModal,
}: UseSafetySettingConfigModalProps) {
    const { t } = useTranslation();

    const setGeminiSafetyFilter = (key: GeminiSafetySetting.FilterNames, value: GeminiSafetySetting.Threshold) => {
        onChange(prev => ({
            ...prev,
            promptOnly: {
                ...prev.promptOnly,
                model: {
                    ...prev.promptOnly.model,
                    safety_settings: {
                        ...prev.promptOnly.model.safety_settings,
                        [key]: value,
                    }
                }
            },
            changed: {
                ...prev.changed,
                model: true,
            }
        }))
    }

    useHotkey({
        'Escape': () => closeModal(),
    }, focused);

    return {
        setGeminiSafetyFilter,
    }
}
