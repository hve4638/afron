import DropdownForm, { Dropdown } from '@/components/forms/DropdownForm';

interface VerbosityFormProps {
    model: ChatAIModel;

    value: SupportedVerbosity | undefined;
    onChange: (value: SupportedVerbosity) => void;

    disabled?: boolean;
}

function VerbosityForm({
    model,

    value,
    onChange,

    disabled = false,
}: VerbosityFormProps) {
    const v = model.config.supportedVerbosity;

    return (
        <DropdownForm<SupportedVerbosity>
            label='Verbosity'
            value={value!}
            onChange={(value) => onChange(value)}
            onItemNotFound={(value) => {
                if (value != null) onChange(value);
            }}
        >
            {v.includes('low') && <Dropdown.Item name='low' value='low' />}
            {v.includes('medium') && <Dropdown.Item name='medium' value='medium' />}
            {v.includes('high') && <Dropdown.Item name='high' value='high' />}
        </DropdownForm>
    )
}

export default VerbosityForm;