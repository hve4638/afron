import {
    SupportedThinkingEfforts,
    SupportedVerbosity
} from './thinking-efforts';

export type ChatAIFlags = {
    featured?: boolean;
    stable?: boolean;
    latest?: boolean;
    deprecated?: boolean;
    snapshot?: boolean;
    highCost?: boolean;
}
export type ChatAIConfig = {
    endpoint?: 'chat_completions' | 'responses' | 'generative_language' | 'anthropic' | 'vertexai_gemini' | 'vertexai_claude';
    customEndpoint?: string;

    // tokenizer?: 'default';

    thinking?: 'enabled' | 'disabled' | 'optional';

    allowStream?: boolean;
    allowFunctionCall?: boolean;
    allowStructuredOutput?: boolean;
    allowCaching?: boolean;

    supportGeminiSafetyFilter?: boolean;
    supportThinkingBudget?: boolean;
    supportThinkingEffort?: boolean;
    supportThinkingSummary?: boolean;
    supportVerbosity?: boolean;

    supportedThinkingEfforts: readonly SupportedThinkingEfforts[]; // gpt 추론모델 적용, 기본값: ['low', 'medium', 'high']
    supportedVerbosity: readonly SupportedVerbosity[]; // gpt-5 추론모델 적용, 기본값: ['low', 'medium', 'high']
    thinkingDisableStrategy: 'omit' | 'set_to_zero'; // gemini 계열 적용, 기본값 'omit'

    vertexAILocation?: string;

    excludeParameter?: ExcludeParamter[];

    advancedSettings?: {
        extraHeaders?: Record<string, string>;
        chatCompletionUseMaxTokens?: boolean; // ChatCompletions에서 max_completion_tokens 대신 max_tokens 사용 여부
    }
}

export type ExcludeParamter = 'temperature' | 'max_tokens' | 'top_p';

export type ChatAIModel = {
    metadataId: string;
    modelId: string;
    displayName: string;

    config: ChatAIConfig;
    flags: ChatAIFlags;
}

export type ChatAIModelGroup = {
    groupName: string;

    models: Array<ChatAIModel>;
}

export type ChatAIModelCategory = {
    categoryId: string;
    categoryName: string;

    groups: Array<ChatAIModelGroup>;
}

export type ChatAIModelData = Array<ChatAIModelCategory>

export { };