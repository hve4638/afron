import { NumberForm } from "../Forms";

interface TemperatureFormProps {
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
}: TemperatureFormProps) {
    return (
        <NumberForm
            name='Top P'
            value={value}
            onChange={onChange}

            allowDecimal={false}
            instantChange={true}

            allowEmpty={allowEmpty}
            disabled={disabled}
        />
    )
}

export default TemperatureForm;