import { SetStateAction, useMemo, useState } from 'react';
import { GeminiSafetySetting, ModelConfiguration } from '@afron/types';
import { useTranslation } from 'react-i18next';

import useModalDisappear from '@/hooks/useModalDisappear';
import useHotkey from '@/hooks/useHotkey';
import useTrigger from '@/hooks/useTrigger';

import { Modal, ModalHeader } from '@/components/modal';
import Subdescription from '@/components/atoms/Description';
import { Column, Row } from '@/components/layout';
import ModelForm from '@/components/model-ui';

import { PromptDataPO } from './types';
import { PromptEditorData } from '../../hooks';

type UseSafetySettingConfigModalProps = {
    promptEditorData: PromptEditorData;
}

export function useSafetySettingConfigModal({
    promptEditorData,
}: UseSafetySettingConfigModalProps) {
    const { t } = useTranslation();

    const { usePromptDataUpdateOn } = promptEditorData.event;

    const buildSafetySetting = () => {
        const data = promptEditorData.get();

        return (
            data.promptOnly.enabled
                ? data.promptOnly.model.safety_settings
                : null
        );
    }

    const [safetySetting, setSafetySetting] = useState(buildSafetySetting);

    const setGeminiSafetyFilter = (key: GeminiSafetySetting.FilterNames, value: GeminiSafetySetting.Threshold) => {
        promptEditorData.action.setModelConfig(prev => ({
            ...prev,
            safety_settings: {
                ...prev.safety_settings,
                [key]: value,
            }
        }))
    }

    usePromptDataUpdateOn('updated', () => {
        setSafetySetting(buildSafetySetting());
    }, []);

    return {
        safetySetting,
        setGeminiSafetyFilter,
    }
}
