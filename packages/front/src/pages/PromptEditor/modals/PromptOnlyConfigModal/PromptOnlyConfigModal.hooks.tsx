import { useTranslation } from 'react-i18next';

import useHotkey from '@/hooks/useHotkey';
import { ModelConfiguration } from '@afron/types';
import { SetStateAction } from 'react';
import { PromptDataPO } from './types';

type usePromptOnlyConfigModalProps = {
    data: PromptDataPO;
    onChange: (data: SetStateAction<PromptDataPO>) => void;

    focused: boolean;
    closeModal: () => void;
}

export function usePromptOnlyConfigModal({
    data,
    onChange,

    focused,
    closeModal,
}: usePromptOnlyConfigModalProps) {

    const setModelConfig = <TKey extends keyof ModelConfiguration,>(
        key: TKey,
        value: ModelConfiguration[TKey]
    ) => {
        onChange(prev => {
            // promptonly 모드에서만 모델 설정이 적용됨
            if (!prev.promptOnly.enabled) return prev;

            return {
                ...prev,
                promptOnly: {
                    ...prev.promptOnly,
                    model: {
                        ...prev.promptOnly.model,
                        [key]: value,
                    },
                },
                changed: {
                    ...prev.changed,
                    model: true,
                }
            }
        });
    }

    useHotkey({
        'Escape': () => closeModal()
    }, focused);

    return {
        setModelConfig,
    };
}