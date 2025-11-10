import { useCallback, useLayoutEffect } from 'react';
import { RTFlowNodeOptions } from '@afron/types';

import { Column, Gap } from '@/components/layout';
import { DropdownForm, Form } from '@/components/forms';


import Delimiter from '@/components/Delimiter';
import { GIcon } from '@/components/GoogleFontIcon';

import { NodeOptionProps } from '../../types';

export function RunNodeOption({
    option,
    setOption,
}: NodeOptionProps<RTFlowNodeOptions.RTStart>) {
    const changeOption = useCallback((key: string, value: any) => {
        setOption((prev) => ({
            ...prev,
            [key]: value,
        }));
    }, [setOption]);

    useLayoutEffect(() => {
        if (option.allow_input_text == null) changeOption('allow_input_text', true);
        if (option.allow_input_image == null) changeOption('allow_input_image', false);
        if (option.allow_input_pdf == null) changeOption('allow_input_pdf', false);
    }, [])

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
                align='right'
                value={option.start_trigger}
                onChange={(next) => changeOption('start_trigger', next)}
                onItemNotFound={(first) => changeOption('start_trigger', first)}
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
                            <span>실행 시</span>
                        </>
                    }
                    value='start'
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
            </DropdownForm>
            <Gap h='1em' />
            {
                option.start_trigger === 'press-button' &&
                <>
                    <strong className='undraggable'>버튼</strong>
                    <Delimiter />
                    <Form.String
                        name='버튼 이름'
                        value={option.button_label}
                        onChange={(next) => changeOption('button_label', next)}
                    />
                    <Gap h='1em' />
                </>
            }

            <strong className='undraggable'>입력 설정</strong>
            <Delimiter />
            <Form.CheckBox
                name='채팅 기록 보존'
                checked={option.include_chat_history}
                onChange={(next) => changeOption('include_chat_history', next)}
            />

            <Gap h='1em' />
            <strong className='undraggable'>입력 허용</strong>
            <Delimiter />
            <Form.CheckBox
                name='텍스트'
                checked={option.allow_input_text}
                onChange={(next) => changeOption('allow_input_text', next)}
            />
            <Form.CheckBox
                name='이미지'
                checked={option.allow_input_image}
                onChange={(next) => changeOption('allow_input_image', next)}
            />
            <Form.CheckBox
                name='PDF'
                checked={option.allow_input_pdf}
                onChange={(next) => changeOption('allow_input_pdf', next)}
            />
            <Form.CheckBox
                name='그외 파일'
                checked={option.allow_input_files}
                onChange={(next) => changeOption('allow_input_files', next)}
            />
        </Column>
    )
}