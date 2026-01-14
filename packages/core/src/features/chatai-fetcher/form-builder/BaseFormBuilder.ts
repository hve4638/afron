import { ChatMessages } from '@hve/chatai';
import { FormBuilderProps } from './types';
import { ChatAIConfig, ModelConfiguration } from '@afron/types';

/**
 * '@hve/chatai' 라이브러리의 ChatAI 인자에 들어가는 form 빌더
 * 
 * 공통 요청 form을 제공하는 getBase() 및 protected 유틸 메서드 제공
 * 
 * 각 하위 클래스에서 BaseFormBuilder를 상속받아 각 endpoint 별 form 빌더를 구현함
 */
class BaseFormBuilder {
    protected modelId: string;
    protected modelInfo: ChatAIConfig;
    protected modelConfig: Required<ModelConfiguration>;
    protected messages: ChatMessages;

    constructor(props: FormBuilderProps) {
        this.modelId = props.modelId;
        this.modelConfig = props.modelConfig;
        this.modelInfo = props.modelInfo;
        this.messages = props.messages;
    }

    build() {
        return this.getBase();
    }

    protected getBase() {
        let {
            temperature,
            top_p,
            max_tokens,

        } = this.modelConfig;
        const {
            customEndpoint,
            excludeParameter = [],
            advancedSettings,
        } = this.modelInfo;
        const excludeMaxTokens =  excludeParameter.includes('max_tokens');
        const excludeTemperature = excludeParameter.includes('temperature');
        const excludeTopP = excludeParameter.includes('top_p');

        

        return {
            model: this.modelId,
            messages: this.messages,

            max_tokens: excludeMaxTokens ? undefined : max_tokens,
            temperature: excludeTemperature ? undefined : temperature,
            top_p: excludeTopP ? undefined : top_p,
            url: customEndpoint,
            headers: advancedSettings?.extraHeaders,
        };
    }

    protected isThinkingEnabled() {
        return (
            this.modelInfo.thinking === 'enabled'
            || (
                this.modelInfo.thinking === 'optional'
                && this.modelConfig.use_thinking
            )
        );
    }

    protected getThinkingToken() {
        if (this.isThinkingEnabled()) {
            return this.modelConfig.thinking_tokens;
        }
        else if ((this.modelInfo.thinking ?? 'disabled') === 'disabled') {
            return undefined;
        }
        else if (this.modelInfo.thinkingDisableStrategy === 'set_to_zero') {
            return 0;
        }
        else {
            return;
        }
    }

    // get gemini() {
    //     this.#gemini ??= new GeminiFormBuilder(this.#props);
    //     return this.#gemini;
    // }

}

export default BaseFormBuilder;