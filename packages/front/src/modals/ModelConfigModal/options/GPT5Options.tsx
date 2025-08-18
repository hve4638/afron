import { CheckBoxForm } from '@/components/forms';
import Delimiter from '@/components/Delimiter';
import ModelForm from '@/components/model-ui';

import { OptionsProps } from './types';

function GPT5Options({
    model,
    config,
    refresh,
}: OptionsProps) {
    const disabled = !config.override_enabled || !config.override_gpt5;

    return (
        <>
            <CheckBoxForm
                style={{ marginBottom: '0.25em' }}
                label={<b>GPT 설정 덮어쓰기</b>}
                checked={config.override_gpt5 ?? false}
                onChange={(next) => {
                    config.override_gpt5 = next;
                    refresh();
                }}

                disabled={!config.override_enabled}
            />
            <Delimiter />
            {
                model.config.supportVerbosity &&
                <ModelForm.Verbosity
                    value={config.verbosity}
                    onChange={(next) => {
                        config.verbosity = next;
                        refresh();
                    }}

                    disabled={disabled}
                />
            }
        </>
    )
}

export default GPT5Options;