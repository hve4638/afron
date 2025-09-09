import Delimiter from '@/components/Delimiter';
import { CheckBoxForm } from '@/components/forms_';
import SafetyFilterSlider from './SafetyFilterSlider';

type SafetySetting = Partial<Record<GeminiSafetySetting.FilterNames, GeminiSafetySetting.Threshold>>;

interface SafetyFilterFormProps {
    value: SafetySetting;
    onChange: (value: SafetySetting) => void;

    allowEmpty?: boolean;
    disabled?: boolean;
}

function SafetyFilterForm({
    value,
    onChange,
    
    disabled = false,
}: SafetyFilterFormProps) {

    return (
        <>
            <SafetyFilterSlider
                // HARASSMENT
                name='괴롭힘'
                value={value.HARM_CATEGORY_HARASSMENT ?? 'OFF'}
                onChange={(next) => {
                    const key = 'HARM_CATEGORY_HARASSMENT' as GeminiSafetySetting.FilterNames;
                    onChange({ [key]: next });
                }}
                disabled={disabled}
            />
            <SafetyFilterSlider
                // HATE_SPEECH
                name='증오심 표현'
                value={value.HARM_CATEGORY_HATE_SPEECH ?? 'OFF'}
                onChange={(next) => {
                    const key = 'HARM_CATEGORY_HATE_SPEECH' as GeminiSafetySetting.Threshold;
                    onChange({ [key]: next });
                }}
                disabled={disabled}
            />
            <SafetyFilterSlider
                // name='SEXUALLY_EXPLICIT'
                name='음란물'
                value={value.HARM_CATEGORY_SEXUALLY_EXPLICIT ?? 'OFF'}
                onChange={(next) => {
                    const key = 'HARM_CATEGORY_SEXUALLY_EXPLICIT' as GeminiSafetySetting.FilterNames;
                    onChange({ [key]: next });
                }}
                disabled={disabled}
            />
            <SafetyFilterSlider
                // name='DANGEROUS_CONTENT'
                name='위험한 콘텐츠'
                value={value.HARM_CATEGORY_DANGEROUS_CONTENT ?? 'OFF'}
                onChange={(next) => {
                    const key = 'HARM_CATEGORY_DANGEROUS_CONTENT' as GeminiSafetySetting.FilterNames;
                    onChange({ [key]: next });
                }}
                disabled={disabled}
            />
            <SafetyFilterSlider
                // name='CIVIC_INTEGRITY'
                name='시민의식'
                value={value.HARM_CATEGORY_CIVIC_INTEGRITY ?? 'OFF'}
                onChange={(next) => {
                    const key = 'HARM_CATEGORY_CIVIC_INTEGRITY' as GeminiSafetySetting.FilterNames;
                    onChange({ [key]: next });
                }}
                disabled={disabled}
            />
            <div style={{ height: '0.25em' }} />
        </>
    )
}

export default SafetyFilterForm