import { GoogleFontIcon } from 'components/GoogleFontIcon';
import { TextInput } from 'components/Input';
import { Align, Flex, Grid, Row } from 'components/layout';
import { useLayoutEffect } from 'react';
import DropdownForm, { Dropdown } from '@/components/forms/DropdownForm';
import { RTVarConfig } from '@afron/types';
import { AdditionsProps } from './types';

export function SelectAddition({
    target,
    varId,
    varAction,
}: AdditionsProps) {
    const selectConfig = target.data.config.select!;
    const setConfig = (callback: Parameters<typeof varAction.setDataConfig<'select'>>[2]) => varAction.setDataConfig(varId, 'select', callback);

    useLayoutEffect(() => {
        if (!selectConfig.options) {
            addOption();
        }
    }, [selectConfig]);

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

        const currentOptions = selectConfig.options ?? [];
        const num = currentOptions.length + 1;

        const name = `선택 ${num}`;
        let baseValue = `select-${num}`;
        let value: string;
        let index = -1;

        do {
            value = baseValue + makeAlphabetIndex(index);
            index++;
        } while (currentOptions.find((item) => item.value === value) != undefined);

        setConfig((prev) => ({
            ...prev,
            options: [...currentOptions, { name, value }],
        }));
    }

    return (
        <>
            <hr />
            <DropdownForm
                label='기본값'
                value={selectConfig.default_value ?? ''}
                onChange={(next) => {
                    setConfig((prev) => ({
                        ...prev,
                        default_value: next,
                    }));
                }}
                onItemNotFound={(first) => {
                    if (first != null) {
                        setConfig((prev) => ({
                            ...prev,
                            default_value: first,
                        }));
                    }
                }}
            >
                {
                    (selectConfig.options ?? []).map((option, i) => (
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
                    selectConfig.options != null &&
                    selectConfig.options.map((option, index) => (
                        <SelectOption
                            key={index}
                            option={option}
                            onChangeName={(name) => {
                                const currentOptions = selectConfig.options ?? [];
                                const updatedOptions = currentOptions.map((opt, idx) =>
                                    idx === index ? { ...opt, name } : opt
                                );
                                setConfig((prev) => ({
                                    ...prev,
                                    options: updatedOptions,
                                }));
                            }}
                            onChangeValue={(value) => {
                                const currentOptions = selectConfig.options ?? [];
                                const filtered = currentOptions.filter((item) => item.value === value);
                                if (
                                    filtered.length === 0
                                    || (filtered.length === 1 && filtered[0] === option)
                                ) {
                                    const updatedOptions = currentOptions.map((opt, idx) =>
                                        idx === index ? { ...opt, value } : opt
                                    );
                                    setConfig((prev) => ({
                                        ...prev,
                                        options: updatedOptions,
                                    }));
                                }
                            }}
                            onDelete={(option) => {
                                const currentOptions = selectConfig.options ?? [];
                                const next = currentOptions.filter((item) => item !== option);
                                setConfig((prev) => ({
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