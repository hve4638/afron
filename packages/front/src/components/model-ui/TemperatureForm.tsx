import { NumberForm } from "../forms_";

interface MaxTokenFormProps {
    value: number | undefined;
    onChange: (value: number | undefined) => void;

    allowEmpty?: boolean;
    disabled?: boolean;
}

function TemperatureForm({
    value,
    onChange,
    allowEmpty = false,

    disabled = false,
}: MaxTokenFormProps) {
    return (
        <NumberForm
            name='온도'
            value={value}
            onChange={onChange}

            allowDecimal={true}
            instantChange={true}

            allowEmpty={allowEmpty}
            disabled={disabled}
        />
    )
}

export default TemperatureForm;