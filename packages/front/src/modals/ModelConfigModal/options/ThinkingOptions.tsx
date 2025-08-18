import Delimiter from '@/components/Delimiter';
import { CheckBoxForm, NumberForm } from '@/components/forms';
import { OptionsProps } from './types';
import ModelForm from '@/components/model-ui';

function ThinkingOptions({
    model,
    config,
    refresh,
}: OptionsProps) {
    const disabled = !config.override_enabled || !config.override_thinking;

    return (
        <>
            <CheckBoxForm
                style={{ marginBottom: '0.25em' }}
                label={<b>추론 설정 덮어쓰기</b>}
                checked={config.override_thinking ?? false}
                onChange={(next) => {
                    config.override_thinking = next;
                    refresh();
                }}
                disabled={!config.override_enabled}
            />
            <Delimiter />
            {
                model.config.thinking === 'optional'
                && <ModelForm.ThinkingEnabled
                    value={config.use_thinking}
                    onChange={(next) => {
                        config.use_thinking = next ?? undefined;
                        refresh();
                    }}
                    disabled={disabled}
                />
            }
            {
                model.config.supportThinkingBudget
                && <ModelForm.ThinkingTokens
                    value={config.thinking_tokens}
                    onChange={(next) => {
                        config.thinking_tokens = next ?? undefined;
                        refresh();
                    }}
                    allowEmpty={true}
                    disabled={disabled}
                />
            }
            {
                model.config.supportThinkingEffort
                && <ModelForm.ReasoningEffort
                    value={config.thinking_effort}
                    onChange={(next) => {
                        config.thinking_effort = next;
                        refresh();
                    }}

                    allowEmpty={true}
                    disabled={disabled}
                />
            }
            {
                model.config.supportThinkingSummary
                && <CheckBoxForm
                    name='추론 요약 제공'
                    checked={config.thinking_summary ?? false}
                    onChange={(next) => {
                        config.thinking_summary = next ?? undefined;
                        refresh();
                    }}
                    disabled={disabled}
                />
            }
        </>
    )
}

export default ThinkingOptions