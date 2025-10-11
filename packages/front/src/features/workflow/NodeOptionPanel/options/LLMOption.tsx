import ModelForm from '@/components/model-ui';
import { Column, Gap } from '@/components/layout';
import { OptionProps } from './types';
import { useCallback } from 'react';
import { DropdownForm } from '@/components/forms';

export function LLMOption({ option, setOption }: OptionProps) {
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
            }}
        >
            <strong>모델 지정</strong>
            <hr />
            <DropdownForm
                label='모델 지정 방식'
                value={'model1'}
            >
                <DropdownForm.Item name='사용자 선택' value='user'/>
                {/* <DropdownForm.Item name='모델 유형 선택' value='limit_model_category'/> */}
                <DropdownForm.Item name='모델 지정' value='specific_model'/>
            </DropdownForm>
            <DropdownForm
                label='모델'
                value={'model1'}
            >
                <DropdownForm.Item name='사용자 선택' value='user'/>
                {/* <DropdownForm.Item name='모델 유형 선택' value='limit_model_category'/> */}
                <DropdownForm.Item name='모델 지정' value='specific_model'/>
            </DropdownForm>

            <Gap h='8px' />
            <strong>모델 옵션</strong>
            <hr />
            <ModelForm.MaxToken
                value={option['max_tokens']}
                onChange={(value) => changeOption('max_tokens', value)}
            />
            <ModelForm.Temperature
                value={option['temperature']}
                onChange={(value) => changeOption('temperature', value)}
                allowEmpty={true}
            />
            <ModelForm.TopP
                value={option['top_p']}
                onChange={(value) => changeOption('top_p', value)}
                allowEmpty={true}
            />
            <div style={{ height: '1em' }} />

            <ModelForm.ThinkingEnabled
                value={'' as any}
                onChange={() => { }}
            // value={data.model.use_thinking ?? false}
            // onChange={(checked) => changeModelConfig('use_thinking', checked)}
            />
            <ModelForm.ThinkingTokens
                value={'' as any}
                onChange={() => { }}
            // value={data.model.thinking_tokens}
            // onChange={(checked) => changeModelConfig('thinking_tokens', checked ?? 0)}
            />
            {/* <ModelForm.ReasoningEffort
                value={'' as any}
                onChange={() => { }}
            />
            <ModelForm.Verbosity
                value={'' as any}
                onChange={() => { }}
            /> */}
        </Column>
    )
}