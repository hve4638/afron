import { useState } from 'react';
import { GeminiSafetySetting } from '@afron/types';
import { useTranslation } from 'react-i18next';

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
