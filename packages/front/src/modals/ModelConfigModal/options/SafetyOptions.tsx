import Delimiter from '@/components/Delimiter';
import { CheckBoxForm } from '@/components/forms';
import SafetyFilterSlider from './SafetyFilterSlider';
import { OptionsProps } from './types';
import ModelForm from '@/components/model-ui';
import { useMemo } from 'react';

function SafetyOptions({
    model,
    config,

    refresh,
}: OptionsProps) {
    const disabled = !config.override_enabled || !config.override_safety_settings;
    const safetySettings = config?.safety_settings ?? {};

    if (!model.config.supportGeminiSafetyFilter) {
        return <></>;
    }

    return (
        <>
            <CheckBoxForm
                style={{ marginBottom: '0.25em' }}
                label={<b>안전 필터 덮어쓰기</b>}
                checked={config.override_safety_settings ?? false}
                onChange={(next) => {
                    config.override_safety_settings = next;
                    refresh();
                }}
                disabled={!config.override_enabled}
            />
            <Delimiter />
            <ModelForm.SafetyFilter
                value={safetySettings}
                onChange={(key, threshold) => {
                    config.safety_settings = {
                        ...safetySettings,
                        [key]: threshold,
                    };
                    refresh();
                }}
                allowEmpty={true}
                disabled={disabled}
            />
        </>
    )
}

export default SafetyOptions