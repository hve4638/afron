import { CheckBoxForm } from "../forms_";

interface ThinkingEnabledProps {
    value: boolean | undefined;
    onChange: (value: boolean) => void
    disabled?: boolean;
}

function ThinkingEnabledForm({
    value,
    onChange,

    disabled = false,
}: ThinkingEnabledProps) {
    return (
        <CheckBoxForm
            name='추론 활성화'
            checked={value ?? false}
            onChange={onChange}
            disabled={disabled}
        />
    )
}

export default ThinkingEnabledForm;