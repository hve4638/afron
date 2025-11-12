import classNames from 'classnames';

import { Column, Flex, Row } from '@/components/layout';

import { FormFieldProps } from './types';

import { CheckBoxField, NumberField, SelectField, TextField } from './primary-fields';

import styles from './styles.module.scss';
import { GIconButton } from '@/components/atoms/GoogleFontIcon';
import { useCallback } from 'react';
import StructField from './StructField';
import { getRTVarConfigDefaultValue } from '../utils';
import { RTVarConfig } from '@afron/types';

interface ArrayFieldProps extends FormFieldProps<'array', unknown[]> {
    arrayConfig: RTVarConfig.Array;
}

function ArrayField({ name, onChange, value, arrayConfig }: ArrayFieldProps) {
    const elementCompoment = useCallback((elementValue: any, index: number) => {
        const change = (nextElement: unknown) => {
            const newValue = [...value];
            newValue[index] = nextElement;
            onChange((prev) => {
                const next = [...prev];
                next[index] = nextElement;
                return next;
            });
        }

        const name = `[${index}]`;
        switch (arrayConfig.element_type) {
            case 'text':
                return <TextField
                    name={name}
                    value={elementValue}
                    onChange={change}
                />
            case 'number':
                return <NumberField
                    name={name}
                    value={elementValue}
                    onChange={change}
                />
            case 'checkbox':
                return <CheckBoxField
                    name={name}
                    value={elementValue}
                    onChange={change}
                />
            case 'select':
                return <SelectField
                    name={name}
                    value={elementValue}
                    options={arrayConfig.config.select?.options ?? []}
                    onChange={change}
                />
            case 'struct':
                return (
                    <Row
                        style={{ width: '100%', marginBottom: '2px' }}
                    >
                        <span className='undraggable'>{name}</span>
                        <StructField
                            name={name}
                            fields={arrayConfig.config.struct?.fields ?? []}

                            value={elementValue}
                            onChange={change}
                        />
                    </Row>
                )
        }
    }, [onChange]);
    const addElement = () => {
        const varData = {
            type: arrayConfig.element_type,
            config: arrayConfig.config
        }
        const defaultValue = getRTVarConfigDefaultValue(varData);
        const newValue = [...value, defaultValue];
        onChange(newValue);
    }

    return (
        <Column
            style={{
                width: '100%',
            }}
        >
            <Row
                className='wfill'
                style={{
                    height: '1.4em',
                    lineHeight: '1.4'
                }}
            >
                <span
                    className='undraggable'
                    style={{

                        padding: '0px',
                        margin: '0px',
                    }}
                >{name}</span>
                <Flex />
                <GIconButton
                    value='add'
                    style={{
                        fontSize: '1em',
                        lineHeight: '1',
                        width: '1.4em',
                        height: '1.4em',
                    }}
                    hoverEffect='square'
                    onClick={() => {
                        addElement();
                    }}
                />
            </Row>

            <Column
                className={classNames(styles['struct-field'])}
                style={{
                    width: '100%',
                    paddingLeft: '0.75em',
                    gap: '0.3em',
                }}
            >
                {
                    value.map((v, i) =>
                        <Row
                            key={i}
                            style={{
                                width: '100%',
                                gap: '0.25em',
                            }}
                        >
                            <Flex>{elementCompoment(v, i)}</Flex>
                            <GIconButton
                                value='delete'
                                hoverEffect='square'

                                style={{
                                    fontSize: '1em',
                                    lineHeight: '1',
                                    width: '1.4em',
                                    height: '1.4em',
                                }}

                                onClick={() => {
                                    const newValue = [...value];
                                    newValue.splice(i, 1);
                                    onChange(newValue);
                                }}
                            />
                        </Row>
                    )
                }
            </Column>
        </Column>
    )
}

export default ArrayField;