import DropdownForm, { Dropdown } from '@/components/forms_/DropdownForm';

interface ReasoningEffortFormProps {
    candidates?: readonly SupportedThinkingEfforts[];

    value?: SupportedThinkingEfforts;
    onChange: (value: SupportedThinkingEfforts) => void;

    allowEmpty?: boolean;
    disabled?: boolean;
}

function ReasoningEffortForm({
    candidates = ['minimal', 'low', 'medium', 'high'],

    value,
    onChange,

    disabled = false,
}: ReasoningEffortFormProps) {
    return (
        <DropdownForm<SupportedThinkingEfforts>
            label='Reasoning Effort'
            value={value!}
            onChange={(next) => onChange(next)}
            onItemNotFound={(next) => {
                if (next != null) onChange(next);
            }}
        >
            {candidates.includes('minimal') && <Dropdown.Item name='minimal' value='minimal' />}
            {candidates.includes('low') && <Dropdown.Item name='low' value='low' />}
            {candidates.includes('medium') && <Dropdown.Item name='medium' value='medium' />}
            {candidates.includes('high') && <Dropdown.Item name='high' value='high' />}
        </DropdownForm>
    )
}

export default ReasoningEffortForm;