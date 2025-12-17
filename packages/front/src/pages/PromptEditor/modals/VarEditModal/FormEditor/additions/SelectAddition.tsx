import { useLayoutEffect } from 'react';
import { GoogleFontIcon } from '@/components/atoms/GoogleFontIcon';
import { TextInput } from 'components/Input';
import { Align, Flex, Grid, Row } from 'components/layout';
import DropdownForm, { Dropdown } from '@/components/FormFields/DropdownForm';
import { AdditionProps } from './types';


export function SelectAddition({
    varId,
    varAction,

    config,
    onConfigChange,
}: AdditionProps<'select'>) {
    useLayoutEffect(() => {
        if (!config.options) {
            addOption();
        }
    }, [config]);

    const addOption = () => {
        const makeAlphabetIndex = (num: number) => {
            const alphabet = 'abcdefghijklmnopqrstuvwxyz';

            if (num < 0) return '';
            if (num <= 26) return alphabet[num];

            let n = num - 1;
            let label = '';
            while (n >= 0) {
                label = alphabet[n % 26] + label;
                n = Math.floor(n / 26) - 1;
            }
            return label;
        }

        const currentOptions = config.options ?? [];
        const num = currentOptions.length + 1;

        const name = `선택 ${num}`;
        const baseValue = `select-${num}`;
        let value: string;
        let index = -1;

        do {
            value = baseValue + makeAlphabetIndex(index);
            index++;
        } while (currentOptions.find((item) => item.value === value) != undefined);

        onConfigChange((prev) => ({
            ...prev,
            options: [...currentOptions, { name, value }],
        }));
    }

    return (
        <>
            <hr />
            <DropdownForm
                label='기본값'
                value={config.default_value ?? ''}
                onChange={(next) => {
                    onConfigChange((prev) => ({
                        ...prev,
                        default_value: next,
                    }));
                }}
                onItemNotFound={(first) => {
                    if (first != null) {
                        onConfigChange((prev) => ({
                            ...prev,
                            default_value: first,
                        }));
                    }
                }}
            >
                {
                    (config.options ?? []).map((option, i) => (
                        <Dropdown.Item
                            name={option.name} value={option.value} key={i}
                        />
                    ))
                }
            </DropdownForm>
            <hr />
            <Row
                className='undraggable'
                rowAlign={Align.SpaceBetween}
                style={{
                    width: '100%',
                    height: '32px',
                }}
            >
                <div>옵션</div>
                <GoogleFontIcon
                    enableHoverEffect={true}
                    value='add'
                    style={{
                        width: '32px',
                        height: '32px',
                        cursor: 'pointer',
                        fontSize: '24px'
                    }}
                    onClick={() => {
                        addOption();
                    }}
                />
            </Row>
            <div
                style={{
                    display: 'block',
                    overflowY: 'auto',
                }}
            >
                {
                    config.options != null &&
                    config.options.map((option, index) => (
                        <SelectOption
                            key={index}
                            option={option}
                            onChangeName={(name) => {
                                const currentOptions = config.options ?? [];
                                const updatedOptions = currentOptions.map((opt, idx) =>
                                    idx === index ? { ...opt, name } : opt
                                );
                                onConfigChange((prev) => ({
                                    ...prev,
                                    options: updatedOptions,
                                }));
                            }}
                            onChangeValue={(value) => {
                                const currentOptions = config.options ?? [];
                                const filtered = currentOptions.filter((item) => item.value === value);
                                if (
                                    filtered.length === 0
                                    || (filtered.length === 1 && filtered[0] === option)
                                ) {
                                    const updatedOptions = currentOptions.map((opt, idx) =>
                                        idx === index ? { ...opt, value } : opt
                                    );
                                    onConfigChange((prev) => ({
                                        ...prev,
                                        options: updatedOptions,
                                    }));
                                }
                            }}
                            onDelete={(option) => {
                                const currentOptions = config.options ?? [];
                                const next = currentOptions.filter((item) => item !== option);
                                onConfigChange((prev) => ({
                                    ...prev,
                                    options: next,
                                }));
                            }}
                        />
                    ))
                }
            </div>
        </>
    );
}

/// @TODO : 원래 타입 정의 어디감??
type PromptVarSelectOption = { name: string; value: string; };

type SelectOptionProps = {
    option: PromptVarSelectOption;
    onChangeName: (name: string) => void;
    onChangeValue: (value: string) => void;
    onDelete: (option: PromptVarSelectOption) => void;
}

function SelectOption({
    option,
    onChangeName,
    onChangeValue,
    onDelete,
}: SelectOptionProps) {
    return (
        <Grid
            columns='16px 3em 128px 2.5em 128px 4px 32px'
            rows='100%'
            style={{
                width: '100%',
                height: '32px',
                fontSize: '16px',
            }}
        >
            <span />
            <span className='center undraggable'>이름</span>
            <TextInput
                value={option.name}
                onChange={onChangeName}
                style={{
                    width: '100%',
                    height: '90%',
                    padding: '0px 6px',
                    margin: 'auto'
                }}
            />
            <span className='center undraggable'>키</span>
            <TextInput
                value={option.value}
                onChange={onChangeValue}
                style={{
                    width: '100%',
                    height: '90%',
                    padding: '0px 6px',
                    margin: 'auto'
                }}
            />
            <div />
            <GoogleFontIcon
                enableHoverEffect={true}
                value='delete'
                style={{
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    fontSize: '18px'
                }}
                onClick={() => {
                    onDelete(option);
                }}
            />
        </Grid>
    )
}

export default SelectAddition;