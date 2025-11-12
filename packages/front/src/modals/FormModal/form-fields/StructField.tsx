import classNames from 'classnames';
import { RTVarConfig } from '@afron/types';
import { Column } from '@/components/layout';
import { CheckBoxField, NumberField, SelectField, TextField } from './primary-fields';
import { FormFieldProps } from './types';
import styles from './styles.module.scss';

interface StructFieldProps extends FormFieldProps<'struct', Record<string, any>> {
    fields: RTVarConfig.StructField[];
}

function StructField({ name, fields, value, onChange }: StructFieldProps) {

    return (
        <Column
            style={{
                width: '100%',
            }}
        >
            <span className='undraggable'>{name}</span>
            <Column
                className={classNames(styles['struct-field'])}
                style={{
                    width: '100%',
                    paddingLeft: '0.75em',
                    gap: '0.3em',
                }}
            >
                {
                    fields.map((field, index) => {
                        const change = (next: unknown) => {
                            const nextValue = {
                                ...value,
                                [field.name]: next
                            };
                            onChange(nextValue);
                        }

                        if (field.type === 'text') {
                            return <TextField
                                key={index}
                                
                                name={field.display_name}
                                value={value[field.name] ?? field.config.text?.default_value}
                                onChange={change}
                            />
                        }
                        else if (field.type === 'number') {
                            return <NumberField
                                key={index}
                                
                                name={field.display_name}
                                value={value[field.name] ?? field.config.number?.default_value}
                                onChange={change}
                            />
                        }
                        else if (field.type === 'checkbox') {
                            return <CheckBoxField
                                key={index}
                                
                                name={field.display_name}
                                value={value[field.name] ?? field.config.checkbox?.default_value}
                                onChange={change}
                            />
                        }
                        else if (field.type === 'select') {
                            return <SelectField
                                key={index}
                                
                                name={field.display_name}
                                options={
                                    field.config.select?.options ?? []
                                }
                                value={value[field.name] ?? field.config.select?.default_value}
                                onChange={change}
                            />
                        }
                        else {
                            return <></>
                        }
                    })
                }
            </Column>
        </Column>
    )
}

export default StructField;