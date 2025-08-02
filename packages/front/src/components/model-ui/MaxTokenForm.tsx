import { NumberForm } from "../Forms";

interface MaxTokenFormProps {
    value: number | undefined;
    onChange: (value: number | undefined) => void;

    allowEmpty?: boolean;
    disabled?: boolean;
}

function MaxTokenForm({
    value,
    onChange,
    allowEmpty = false,
    disabled = false,
}: MaxTokenFormProps) {
    return (
        <NumberForm
            name='최대 응답 크기'
            value={value}
            onChange={onChange}

            allowDecimal={false}
            instantChange={true}

            allowEmpty={allowEmpty}
            disabled={disabled}
        />
    )
}

export default MaxTokenForm;