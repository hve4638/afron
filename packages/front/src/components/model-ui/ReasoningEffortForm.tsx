import DropdownForm, { Dropdown } from '@/components/FormFields/DropdownForm';
import { SupportedThinkingEfforts } from '@afron/types';

interface ReasoningEffortFormProps {
    candidates?: readonly SupportedThinkingEfforts[];

    value?: SupportedThinkingEfforts;
    onChange: (value: SupportedThinkingEfforts) => void;

    align?: 'left' | 'right';
    allowEmpty?: boolean;
    disabled?: boolean;
}

function ReasoningEffortForm({
    candidates = ['minimal', 'low', 'medium', 'high'],

    value,
    onChange,

    align,
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
            align={align}
        >
            {candidates.includes('minimal') && <Dropdown.Item name='minimal' value='minimal' />}
            {candidates.includes('low') && <Dropdown.Item name='low' value='low' />}
            {candidates.includes('medium') && <Dropdown.Item name='medium' value='medium' />}
            {candidates.includes('high') && <Dropdown.Item name='high' value='high' />}
        </DropdownForm>
    )
}

export default ReasoningEffortForm;