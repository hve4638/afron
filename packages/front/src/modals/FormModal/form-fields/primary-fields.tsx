import { CheckBoxForm, NumberForm, StringForm } from '@/components/FormFields'
import { FormFieldProps } from './types'
import DropdownForm, { Dropdown } from '@/components/FormFields/DropdownForm'
import { RTForm, RTVarConfig, RTVarData } from '@afron/types'

export function TextField({ name, onChange, value }: FormFieldProps<'text', string>) {
    return <StringForm
        name={name}
        value={value}
        onChange={onChange}
        instantChange={false}
    />
}

export function NumberField({ name, onChange, value }: FormFieldProps<'number', number | undefined>) {
    return <NumberForm
        name={name}
        value={value}
        onChange={onChange}
        instantChange={false}
    />
}

export function CheckBoxField({ name, onChange, value }: FormFieldProps<'checkbox', boolean>) {
    return <CheckBoxForm
        name={name}
        checked={value}
        onChange={onChange}
    />
}

interface SelectFieldForm extends FormFieldProps<'select', string> {
    options: RTVarConfig.Select['options'];
}

export function SelectField({ name, onChange, value, options }: SelectFieldForm) {
    return <DropdownForm
        label={name}
        value={value}
        onChange={(next) => onChange(next)}
    >
        {
            options.map((item, i) => (
                <Dropdown.Item
                    key={i}
                    name={item.name}
                    value={item.value}
                />
            ))
        }
    </DropdownForm>
}
