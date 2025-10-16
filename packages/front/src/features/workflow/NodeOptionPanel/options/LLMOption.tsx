import { useCallback, useLayoutEffect } from 'react';
import { RTFlowNodeOptions } from '@afron/types';

import ModelForm from '@/components/model-ui';
import { Column, Gap } from '@/components/layout';
import { Form } from '@/components/forms';

import { OptionProps } from './types';

export function LLMOption({ option, setOption }: OptionProps<RTFlowNodeOptions.LLM>) {
    const changeOption = useCallback((key: keyof RTFlowNodeOptions.LLM, value: any) => {
        setOption((prev) => ({
            ...prev,
            [key]: value,
        }));
    }, [setOption]);

    useLayoutEffect(() => {
        if (option.model == null) changeOption('model', 'openai:gpt-4');
    }, []);

    return (
        <Column
            style={{
                gap: '3px',
            }}
        >
            <strong>모델 지정</strong>
            <hr />
            <Form.CheckBox
                label='사용자 설정을 사용'
                checked={option.model_selection}
                onChange={(checked) => changeOption('model_selection', checked)}
            />
            {
                option.model_selection == true &&
                <Form.Dropdown
                    label='모델'
                    align='right'
                    value={option.model}
                    onChange={(value) => changeOption('model', value)}
                    onItemNotFound={(value) => changeOption('model', value)}
                >
                    <Form.Dropdown.Item name='GPT-4' value='openai:gpt-4' />
                </Form.Dropdown>
            }

            <Gap h='8px' />
            <strong>모델 옵션</strong>
            <hr />
            <ModelForm.MaxToken
                value={option.max_tokens}
                onChange={(value) => changeOption('max_tokens', value)}
            />
            <ModelForm.Temperature
                value={option.temperature}
                onChange={(value) => changeOption('temperature', value)}
                allowEmpty={true}
            />
            <ModelForm.TopP
                value={option.top_p}
                onChange={(value) => changeOption('top_p', value)}
                allowEmpty={true}
            />
            <div style={{ height: '1em' }} />

            <ModelForm.ThinkingEnabled
                value={option.use_thinking}
                onChange={(value) => changeOption('use_thinking', value)}
            />
            <ModelForm.ThinkingTokens
                value={option.thinking_tokens}
                onChange={(value) => changeOption('thinking_tokens', value)}
            />
            <ModelForm.ReasoningEffort
                value={option.gpt_reasoning_effort}
                onChange={(value) => changeOption('gpt_reasoning_effort', value)}
                align='right'
            />
            <ModelForm.Verbosity
                value={option.gpt_verbosity}
                onChange={(value) => changeOption('gpt_verbosity', value)}
                align='right'
            />
        </Column>
    )
}