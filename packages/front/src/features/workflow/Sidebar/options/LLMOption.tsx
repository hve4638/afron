import ModelForm from '@/components/model-ui';
import { Column, Gap } from '@/components/layout';
import { OptionProps } from './types';

export function LLMOption({ nodeData, refresh }: OptionProps) {
    return (
        <Column
            style={{
                gap: '3px',
            }}
        >
            <strong>모델 지정</strong>
            <hr />
            {/* <DropdownForm
                label='모델'
                value={''}
            >
                <></>
            </DropdownForm> */}

            <Gap h='8px' />
            <strong>모델 옵션</strong>
            <hr />
            <ModelForm.MaxToken
                value={'' as any}
                onChange={() => { }}
            // onChange={(value) => changeModelConfig('max_tokens', value ?? 0)}
            />
            <ModelForm.Temperature
                value={'' as any}
                onChange={() => { }}
                // value={data.model.temperature}
                // onChange={(value) => changeModelConfig('temperature', value ?? 0)}
                allowEmpty={true}
            />
            <ModelForm.TopP
                value={'' as any}
                onChange={() => { }}
            // value={data.model.top_p}
            // onChange={(value) => changeModelConfig('top_p', value ?? 0)}
            // allowEmpty={true}
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