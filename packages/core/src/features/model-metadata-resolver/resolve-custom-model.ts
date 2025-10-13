import { ChatAIConfig, CustomModel } from '@afron/types';


export function resolveCustomModelInfo(customModel: CustomModel): ChatAIConfig {
    const endpoint = (
        customModel.api_format === 'anthropic_claude' ? 'anthropic'
        : customModel.api_format === 'chat_completions' ? 'chat_completions'
        : customModel.api_format === 'generative_language' ? 'generative_language'
        : undefined
    );
    return {
        thinking: 'disabled',
        customEndpoint: customModel.url,
        endpoint,
        
        supportedThinkingEfforts: [],
        supportedVerbosity: [],
        thinkingDisableStrategy: 'omit'
    }
}