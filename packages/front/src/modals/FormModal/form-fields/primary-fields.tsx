import { CheckBoxForm, NumberForm, StringForm } from '@/components/forms_'
import FormFieldProps from './types'
import DropdownForm, { Dropdown } from '@/components/forms_/DropdownForm'

export function TextField({ name, promptVar, onChange, value }: FormFieldProps<PromptVarText, string>) {
    return <StringForm
        name={name ?? promptVar.display_name}
        value={value ?? promptVar.default_value ?? ''}
        onChange={onChange}
        instantChange={false}
    />
}

export function NumberField({ name, promptVar, onChange, value }: FormFieldProps<PromptVarNumber, number | undefined>) {
    return <NumberForm
        name={name ?? promptVar.display_name}
        value={value ?? promptVar.default_value ?? 0}
        onChange={onChange}
        instantChange={false}
    />
}

export function CheckBoxField({ name, promptVar, onChange, value }: FormFieldProps<PromptVarCheckbox, boolean>) {
    return <CheckBoxForm
        name={name ?? promptVar.display_name}
        checked={value ?? promptVar.default_value ?? false}
        onChange={onChange}
    />
}

export function SelectField({ name, promptVar, onChange, value }: FormFieldProps<PromptVarSelect, string>) {
    return <DropdownForm
        label={name ?? promptVar.display_name}
        value={value ?? promptVar.default_value}
        // items={promptVar.options.map((item) => ({ name: item.name, key: item.value }))}
        onChange={(next) => onChange(next)}
    >
        {
            promptVar.options.map((item, i) => (
                <Dropdown.Item
                    key={i}
                    name={item.name}
                    value={item.value}
                />
            ))
        }
    </DropdownForm>
}
