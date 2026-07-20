import { useState } from 'react';
import { ModelConfiguration } from '@afron/types';

import { useOn } from '@/lib/zustbus';
import { PromptDataPO } from './types';
import { PromptEditorData } from '../../hooks';

type usePromptOnlyConfigModalProps = {
    promptEditorData: PromptEditorData;
}

export function usePromptOnlyConfigModal({
    promptEditorData,
}: usePromptOnlyConfigModalProps) {
    const { promptDataUpdateBus } = promptEditorData.event;

    const buildPromptData = () => {
        const data = promptEditorData.get();

        if (data.promptOnly.enabled) {
            return data as Readonly<PromptDataPO>;
        }
        else {
            return null;
        }
    }

    const [promptData, setPromptData] = useState(buildPromptData);

    const setModelConfig = <TKey extends keyof ModelConfiguration,>(
        key: TKey,
        value: ModelConfiguration[TKey]
    ) => {
        promptEditorData.action.setModelConfig(prev => ({
            ...prev,
            [key]: value,
        }));
    }

    useOn(promptDataUpdateBus, 'updated', () => {
        setPromptData(buildPromptData());
    }, []);

    return {
        promptData,
        setModelConfig,
    };
}