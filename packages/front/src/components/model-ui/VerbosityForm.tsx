import DropdownForm, { Dropdown } from '@/components/forms/DropdownForm';
import { SupportedVerbosity } from '@afron/types';

interface VerbosityFormProps {
    candidates?: readonly SupportedVerbosity[];

    value: SupportedVerbosity | undefined;
    onChange: (value: SupportedVerbosity) => void;

    disabled?: boolean;
}

function VerbosityForm({
    candidates = ['low', 'medium', 'high'],

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
            {candidates.includes('low') && <Dropdown.Item name='low' value='low' />}
            {candidates.includes('medium') && <Dropdown.Item name='medium' value='medium' />}
            {candidates.includes('high') && <Dropdown.Item name='high' value='high' />}
        </DropdownForm>
    )
}

export default VerbosityForm;