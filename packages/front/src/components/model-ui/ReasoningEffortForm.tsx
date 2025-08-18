import DropdownForm, { Dropdown } from '@/components/forms/DropdownForm';

interface VerbosityFormProps {
    model: ChatAIModel;
    
    value?: SupportedThinkingEfforts;
    onChange: (value: SupportedThinkingEfforts) => void;

    allowEmpty?: boolean;
    disabled?: boolean;
}

function ReasoningEffortForm({
    model,

    value,
    onChange,

    disabled = false,
}: VerbosityFormProps) {
    const items = model.config.supportedThinkingEfforts;

    return (
        <DropdownForm<SupportedThinkingEfforts>
            label='Reasoning Effort'
            value={value!}
            onChange={(next) => onChange(next)}
            onItemNotFound={(next) => {
                if (next != null) onChange(next);
            }}
        >
            {items.includes('minimal') && <Dropdown.Item name='minimal' value='minimal' />}
            {items.includes('low') && <Dropdown.Item name='low' value='low' />}
            {items.includes('medium') && <Dropdown.Item name='medium' value='medium' />}
            {items.includes('high') && <Dropdown.Item name='high' value='high' />}
        </DropdownForm>
    )
}

export default ReasoningEffortForm;