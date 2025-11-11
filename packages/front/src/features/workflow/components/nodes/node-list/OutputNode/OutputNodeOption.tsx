import { useCallback, useLayoutEffect } from 'react';
import { RTFlowNodeOptions } from '@afron/types';

import { Column, Gap } from '@/components/layout';
import { DropdownForm, Field } from '@/components/FormFields';


import Delimiter from '@/components/atoms/Delimiter';
import { GIcon } from '@/components/atoms/GoogleFontIcon';

import { NodeOptionProps } from '../../types';

export function OutputNodeOption({
    option,
    setOption,
}: NodeOptionProps<RTFlowNodeOptions.Output>) {
    const changeOption = useCallback((key: string, value: any) => {
        setOption((prev) => ({
            ...prev,
            [key]: value,
        }));
    }, [setOption]);

    return (
        <Column
            style={{
                gap: '3px',
                width: '100%',
            }}
        >
            <Field.CheckBox
                label='히스토리에 추가'
                checked={option.include_history}
            />
        </Column>
    )
}