import { dropdownItem } from '../utils';
import { useEffect, useRef } from 'react';
import TextAddition from './TextAddition';
import CheckboxAddition from './CheckboxAddition';
import NumberAddition from './NumberAddition';
import SelectAddition from './SelectAddition';
import StructAddition from './StructAddition';
import DropdownForm, { Dropdown } from '@/components/forms/DropdownForm';

const VAR_DROPDOWN_ITEMS = [
    dropdownItem('텍스트', 'text'),
    dropdownItem('숫자', 'number'),
    dropdownItem('체크박스', 'checkbox'),
    dropdownItem('목록', 'select'),
    dropdownItem('구조체', 'struct'),
]

type ArrayAdditionProps = {
    promptVar: PromptVarArray;
    fieldVarRef: React.MutableRefObject<PromptVar | null> | null;
    onRefresh: () => void;
}

function ArrayAddition({
    promptVar,
    fieldVarRef,
    onRefresh
}: ArrayAdditionProps) {
    const defaultValueCaches = useRef<{
        text?: string,
        number?: number,
        checkbox?: boolean,
        select?: string,
    }>({
        text: '',
        number: 0,
        checkbox: false,
    });

    return (
        <>
            <hr />
            <DropdownForm<Exclude<PromptVarType, 'array'>>
                label='원소 타입'
                value={promptVar.element?.type}
                onChange={(next) => {
                    if (!promptVar.element) {
                        promptVar.element = {} as any;
                    }
                    promptVar.element.type = next;
                    onRefresh();
                }}
                onItemNotFound={(first) => {
                    if (first != null) {
                        if (!promptVar.element) {
                            promptVar.element = {} as any;
                        }
                        promptVar.element.type = first;
                        onRefresh();
                    }
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
                promptVar.element?.type === 'text' &&
                <TextAddition
                    promptVar={promptVar.element}
                    onRefresh={onRefresh}
                />
            }
            {
                promptVar.element?.type === 'checkbox' &&
                <CheckboxAddition
                    promptVar={promptVar.element}
                    onRefresh={onRefresh}
                />
            }
            {
                promptVar.element?.type === 'number' &&
                <NumberAddition
                    promptVar={promptVar.element}
                    onRefresh={onRefresh}
                />
            }
            {
                promptVar.element?.type === 'select' &&
                <SelectAddition
                    promptVar={promptVar.element}
                    onRefresh={onRefresh}
                />
            }
            {
                promptVar.element?.type === 'struct' &&
                <StructAddition
                    promptVar={promptVar.element}
                    fieldVarRef={fieldVarRef}
                    onRefresh={onRefresh}
                />
            }
        </>
    );
}

export default ArrayAddition;