import { useEffect, useRef } from 'react';
import { dropdownItem } from '../../utils';
import TextAddition from './TextAddition';
import CheckboxAddition from './CheckboxAddition';
import NumberAddition from './NumberAddition';
import SelectAddition from './SelectAddition';
import StructAddition from './StructAddition';
import DropdownForm, { Dropdown } from '@/components/FormFields/DropdownForm';
import { AdditionProps } from './types';
import { RTVarDataNaive } from '@afron/types';

const VAR_DROPDOWN_ITEMS = [
    dropdownItem('텍스트', 'text'),
    dropdownItem('숫자', 'number'),
    dropdownItem('체크박스', 'checkbox'),
    dropdownItem('목록', 'select'),
    dropdownItem('구조체', 'struct'),
]

type ArrayElementType = Exclude<RTVarDataNaive['type'], 'array'>;

export function ArrayAddition({
    varId,
    varAction,

    config,
    onConfigChange,
}: AdditionProps<'array'>) {
    const setConfig = (callback: Parameters<typeof varAction.setDataConfig<'array'>>[2]) => varAction.setDataConfig(varId, 'array', callback);
    const setElementConfig = <T extends ArrayElementType>(config: T, value: Parameters<typeof varAction.setDataConfig<T>>[2]) => {
        onConfigChange((prev) => {
            return {
                ...prev,
                config: {
                    ...prev.config,
                    [config]: {
                        ...(prev.config[config] ?? {}),
                        ...(
                            typeof value === 'function'
                                ? value(prev.config[config]!)
                                : value
                        )
                    }
                }
            }
        })
    }
    
    return (
        <>
            <hr />
            <DropdownForm<ArrayElementType>
                label='원소 타입'
                value={config.element_type}
                onChange={(next) => {
                    setConfig((prev) => ({
                        ...prev,
                        element_type: next,
                    }));
                }}
                onItemNotFound={(first) => {
                    if (first == null) return;

                    setConfig((prev) => ({
                        ...prev,
                        element_type: first,
                    }));
                }}
            >
                {
                    VAR_DROPDOWN_ITEMS.map(({ name, value }, i) => (
                        <Dropdown.Item
                            key={i}
                            name={name}
                            value={value}
                        />
                    ))
                }
            </DropdownForm>
            {
                config.element_type === 'text' &&
                <TextAddition
                    varId={varId}
                    varAction={varAction}
                    config={config.config.text!}
                    onConfigChange={(next) => setElementConfig('text', next)}
                />
            }
            {
                config.element_type === 'checkbox' &&
                <CheckboxAddition
                    varId={varId}
                    varAction={varAction}
                    config={config.config.checkbox!}
                    onConfigChange={(next) => setElementConfig('checkbox', next)}
                />
            }
            {
                config.element_type === 'number' &&
                <NumberAddition
                    varId={varId}
                    varAction={varAction}
                    config={config.config.number!}
                    onConfigChange={(next) => setElementConfig('number', next)}
                />
            }
            {
                config.element_type === 'select' &&
                <SelectAddition
                    varId={varId}
                    varAction={varAction}
                    config={config.config.select!}
                    onConfigChange={(next) => setElementConfig('select', next)}
                />
            }
            {
                config.element_type === 'struct' &&
                <StructAddition
                    varId={varId}
                    varAction={varAction}
                    config={config.config.struct!}
                    onConfigChange={(next) => setElementConfig('struct', next)}
                />
            }
        </>
    );
}

export default ArrayAddition;