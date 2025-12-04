import { Column } from '@/components/layout';
import { Modal } from '@/features/modal';

import { ArrayField, CheckBoxField, NumberField, SelectField, StructField, TextField } from './form-fields';
import { useFormModal } from './FormModal.hooks';

function FormModal() {
    const {
        forms,
        variables,
        setVariables,
    } = useFormModal();

    return (
        <Modal
            style={{
                maxHeight: '80%',
                overflowY: 'auto',
            }}
            header = {{
                label: '변수',
                showCloseButton: true,
            }}
            allowEscapeKey={true}
        >
            <Column
                style={{ gap: '0.5em' }}
            >
                {
                    forms.map((form, i) => {
                        const formId = form.id!;
                        const value = variables[formId];
                        const onChange = (next) => {
                            setVariables((prev) => ({
                                ...prev,
                                [formId]: next,
                            }));
                        }

                        if (form.type === 'text') {
                            return <TextField
                                key={formId}

                                name={form.display_name}
                                value={value ?? form.config.text?.default_value}
                                onChange={onChange}
                            />
                        }
                        else if (form.type === 'number') {
                            return <NumberField
                                key={formId}

                                name={form.display_name}
                                value={value ?? form.config.number?.default_value}
                                onChange={onChange}
                            />
                        }
                        else if (form.type === 'checkbox') {
                            return <CheckBoxField
                                key={formId}

                                name={form.display_name}
                                value={value ?? form.config.checkbox?.default_value}
                                onChange={onChange}
                            />
                        }
                        else if (form.type === 'select') {
                            return <SelectField
                                key={formId}
                                name={form.display_name}
                                value={value ?? form.config.select?.default_value}
                                options={form.config.select?.options ?? []}

                                onChange={onChange}
                            />
                        }
                        else if (form.type === 'struct') {
                            return <StructField
                                key={formId}

                                name={form.display_name}
                                fields={form.config.struct?.fields ?? []}

                                value={value ?? {}}
                                onChange={onChange}
                            />
                        }
                        else if (form.type === 'array') {
                            return <ArrayField
                                key={formId}

                                name={form.display_name}
                                arrayConfig={form.config.array!}
                                value={value ?? []}
                                onChange={onChange}
                            />
                        }
                    })
                }
            </Column>
        </Modal>
    );
}

export default FormModal;