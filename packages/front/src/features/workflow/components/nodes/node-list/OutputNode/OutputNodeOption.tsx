import { useCallback, useLayoutEffect } from 'react';
import { RTFlowNodeOptions } from '@afron/types';

import { Column, Gap } from '@/components/layout';
import { DropdownForm, Form } from '@/components/forms';


import Delimiter from '@/components/Delimiter';
import { GIcon } from '@/components/GoogleFontIcon';

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
            <Form.CheckBox
                label='히스토리에 추가'
                checked={option.include_history}
            />
        </Column>
    )
}