import { CheckBoxForm, NumberForm } from "../forms_";

interface ThinkingTokensFormProps {
    value: number | undefined;
    onChange: (value: number | undefined) => void;

    allowEmpty?: boolean;
    disabled?: boolean;
}

function ThinkingTokensForm({
    value,
    onChange,

    disabled = false,
}: ThinkingTokensFormProps) {
    return (
        <NumberForm
            name='추론 토큰 크기'
            value={value}
            onChange={onChange}
            allowDecimal={false}
            disabled={disabled}
        />
    )
}

export default ThinkingTokensForm;