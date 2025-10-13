import { Column, Gap } from '@/components/layout';
import { DropdownForm, Form } from '@/components/forms';

import { OptionProps } from './types';
import Delimiter from '@/components/Delimiter';
import { GIcon } from '@/components/GoogleFontIcon';
import { useCallback } from 'react';

export function StartOption({
    option,
    setOption,
}: OptionProps) {
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
            {/* <Delimiter /> */}
            <DropdownForm
                label='시작 조건'
                value={option['start_trigger'] ?? 'press-send-button'}
                onChange={(next) => {
                    changeOption('start_trigger', next);
                }}
            >
                <DropdownForm.Item
                    name={
                        <>
                            <GIcon
                                style={{
                                    color: 'green',
                                    marginRight: '4px',
                                }}
                                value='play_arrow'
                            />
                            <span>전송 버튼 클릭</span>
                        </>
                    }
                    value='press-send-button'
                />
                <DropdownForm.Item
                    name={
                        <>
                            <GIcon
                                style={{
                                    color: 'orange',
                                    marginRight: '4px',
                                }}
                                value='play_arrow'
                            />
                            <span>버튼 클릭</span>
                        </>
                    }
                    value='press-button'
                />
                <DropdownForm.Item
                    name='입력 그룹 실행'
                    value='start-input-group'
                />
                <DropdownForm.Item
                    name='입력 그룹 편집'
                    value='edit-input-group'
                />
                <DropdownForm.Item
                    name='출력 그룹 실행'
                    value='start-output-group'
                />
                <DropdownForm.Item
                    name='출력 그룹 편집'
                    value='edit-input-group'
                />
            </DropdownForm>
            <Gap h='1em' />

            <div>새로운 버튼</div>
            <Delimiter />
            <Form.String
                name='버튼 이름'
                value='a'
                onChange={() => {

                }}
            />

        </Column>
    )
}