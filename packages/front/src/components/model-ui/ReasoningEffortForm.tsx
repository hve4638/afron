import DropdownForm, { Dropdown } from '@/components/forms/DropdownForm';

interface VerbosityFormProps {
    value?: SupportedThinkingEfforts;
    onChange: (value: SupportedThinkingEfforts) => void;

    allowEmpty?: boolean;
    disabled?: boolean;
}

function ReasoningEffortForm({
    value,
    onChange,

    disabled = false,
}: VerbosityFormProps) {
    return (
        <DropdownForm<SupportedThinkingEfforts>
            label='Reasoning Effort'
            value={value!}
            onChange={(next) => onChange(next)}
            onItemNotFound={(next) => {
                if (next != null) onChange(next);
            }}
        >
            <Dropdown.Item name='low' value='low' />
            <Dropdown.Item name='medium' value='medium' />
            <Dropdown.Item name='high' value='high' />
        </DropdownForm>
    )
}

export default ReasoningEffortForm;