import DropdownForm, { Dropdown } from '@/components/forms/DropdownForm';

interface VerbosityFormProps {
    value: SupportedVerbosity | undefined;
    onChange: (value: SupportedVerbosity) => void;

    disabled?: boolean;
}

function VerbosityForm({
    value,
    onChange,

    disabled = false,
}: VerbosityFormProps) {
    return (
        <DropdownForm<SupportedVerbosity>
            label='Verbosity'
            value={value!}
            onChange={(value) => onChange(value)}
            onItemNotFound={(value) => {
                if (value != null) onChange(value);
            }}
        >
            <Dropdown.Item name='minimal' value='minimal' />
            <Dropdown.Item name='low' value='low' />
            <Dropdown.Item name='medium' value='medium' />
            <Dropdown.Item name='high' value='high' />
        </DropdownForm>
    )
}

export default VerbosityForm;