import Delimiter from '@/components/atoms/Delimiter';
import { CheckBoxForm, NumberForm } from '@/components/FormFields';
import SafetyFilterSlider from './SafetyFilterSlider';
import { OptionsProps } from './types';
import ModelForm from '@/components/model-ui';

function CommonOptions({
    config,
    refresh,
}: OptionsProps) {
    const disabled = !config.override_enabled || !config.override_common;

    const change = (key: 'max_tokens' | 'temperature' | 'top_p', value?: number) => {
        config[key] = value ?? undefined;
        refresh();
    }

    return (
        <>
            <CheckBoxForm
                style={{ marginBottom: '0.25em' }}
                label={<b>공통 설정 덮어쓰기</b>}
                checked={config.override_common ?? false}
                onChange={(next) => {
                    config.override_common = next;
                    refresh();
                }}

                disabled={!config.override_enabled}
            />
            <Delimiter />
            <ModelForm.MaxToken
                value={config.max_tokens}
                onChange={(next) => change('max_tokens', next)}

                allowEmpty={true}
                disabled={disabled}
            />
            <ModelForm.Temperature
                value={config.temperature}
                onChange={(next) => change('temperature', next)}

                allowEmpty={true}
                disabled={disabled}
            />
            <ModelForm.TopP
                value={config.top_p}
                onChange={(next) => change('top_p', next)}

                allowEmpty={true}
                disabled={disabled}
            />
        </>
    )
}

export default CommonOptions;