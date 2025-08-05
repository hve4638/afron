import NoLogger from '@/features/nologger';
import { LevelLogger } from '@/types';
import { ChatAIResult, ChatMessages } from '@hve/chatai';
import { ChatAI } from '@hve/chatai';

import type { ChatAIRequestAPI, RequestModelProps } from './types';
import { ChatAIFetcherFailed } from './errors';

interface RequestProps {
    model: ChatAIModel;
    modelConfiguration: Required<ModelConfiguration>;
    messages: ChatMessages;
    auth: unknown;
}

interface RequestOptions {
    preview?: boolean,
}

class ChatAIFetcher {
    protected logger: LevelLogger;

    constructor(logger?: LevelLogger) {
        this.logger = logger ?? NoLogger.instance;
    }

    /**
     * 
     * @param messages 
     * @param promptData 
     * @param requestAPI 
     */
    async request(
        {
            model,
            messages,
            modelConfiguration,
            auth
        }: RequestProps,
        {
            preview = false
        }: RequestOptions,
    ): Promise<ChatAIResult> {
        const api: ChatAIRequestAPI = (
            preview
                ? ChatAI.previewRequest
                : ChatAI.request
        );

        const category = this.#getAPICategory(model);
        if (category === 'known_provider') {
            return this.#requestKnownProviderModel({
                model,
                modelConfiguration: modelConfiguration,
                messages,
                auth: auth as string,
                api,
            });
        }
        else if (category === 'vertexai') {
            return this.#requestVertexAIModel({
                model,
                modelConfiguration: modelConfiguration,
                messages,
                auth: auth as string,
                api,
            });
        }
        else {
            throw new ChatAIFetcherFailed('Unsupported model API category: ' + category);
        }
    }

    async #requestKnownProviderModel({
        model,
        modelConfiguration,
        messages,
        auth,
        api,
    }: RequestModelProps<string>): Promise<ChatAIResult> {
        const { modelId, config } = model;
        const {
            temperature,
            top_p,
            max_tokens,
            use_thinking,
            thinking_tokens,
        } = modelConfiguration;

        const common = {
            model: modelId,
            messages,
            auth: {
                api_key: auth,
            },

            max_tokens,
            temperature,
            top_p,
        }

        const openAIThinkingEffort = this.#convertThinkingTokenToEffort(thinking_tokens);
        const useThinking = (
            config.thinking === 'enabled'
            || (config.thinking === 'optional' && use_thinking)
        );

        if (config.endpoint === 'responses') {
            this.logger.trace('Requesting ResponsesAPI (OpenAI)');
            return await api.responses({
                thinking_effort: openAIThinkingEffort,

                ...common,
            });
        }
        else if (config.endpoint === 'chat_completions') {
            this.logger.trace('Requesting ChatCompletionsAPI (OpenAI)');
            return await api.chatCompletion({
                ...common,
            });
        }
        else if (config.endpoint === 'generative_language') {
            this.logger.trace('Requesting GenerativeLanguageAPI (Google)');
            return await api.generativeLanguage({
                thinking_tokens: useThinking ? thinking_tokens : undefined,

                ...common,
            });
        }
        else if (config.endpoint === 'anthropic') {
            this.logger.trace('Requesting AnthropicAPI (Anthropic)');
            return await api.anthropic({
                thinking_tokens: useThinking ? thinking_tokens : undefined,

                ...common,
            });
        }

        throw new ChatAIFetcherFailed(`Model '${modelId}' has no provider configured.`);
    }

    async #requestVertexAIModel({
        model,
        modelConfiguration,
        messages,
        auth,
        api,
    }: RequestModelProps): Promise<ChatAIResult> {
        const { modelId, config } = model;

        const {
            temperature,
            top_p,
            max_tokens,
            use_thinking,
            thinking_tokens,
        } = modelConfiguration;

        const useThinking = (
            config.thinking === 'enabled'
            || (config.thinking === 'optional' && use_thinking)
        );
        const vertexAIAuth = auth as VertexAIAuth;
        const location = 'us-east5';

        if (config.endpoint === 'vertexai_gemini') {
            this.logger.trace('Requesting Generative Language API with VertexAI');
            return await api.requestVertexAI({
                publisher: 'google',
                type: 'generative_language',
                location: 'us-central1',

                thinking_tokens: useThinking ? thinking_tokens : undefined,
                model: modelId,
                messages: messages,
                auth: vertexAIAuth,

                max_tokens,
                temperature,
                top_p,
            });
        }
        else if (config.endpoint === 'vertexai_claude') {
            this.logger.trace('Requesting Anthropic API with VertexAI');
            return await api.requestVertexAI({
                publisher: 'anthropic',
                type: 'anthropic',
                location: 'us-east5',

                thinking_tokens: useThinking ? thinking_tokens : undefined,
                model: modelId,
                messages: messages,
                auth: vertexAIAuth,

                max_tokens,
                temperature,
                top_p,
            });
        }

        throw new ChatAIFetcherFailed(`Model '${modelId}' has no provider configured.`);
    }

    // private async requestCustomModel(customModel: CustomModel, modelOptions: ModelOptions, messages: ChatMessages) {
    //     const {
    //         profile,
    //     } = this.nodeData;

    //     const profileAPIKeyControl = new ProfileAPIKeyControl(profile);
    //     const auth = await profileAPIKeyControl.getAuth(customModel.secret_key ?? '');
    //     const apiKey = auth as string;

    //     const {
    //         temperature,
    //         top_p,
    //         max_tokens,
    //         thinking_tokens = 1024,
    //         use_thinking = false,
    //     } = modelOptions;

    //     const openAIThinkingEffort = (
    //         thinking_tokens <= 1024 ? 'low'
    //             : thinking_tokens <= 8192 ? 'medium'
    //                 : 'high'
    //     );
    //     const useThinking = (
    //         customModel.thinking// || (flags.thinking_optional && use_thinking)
    //     );

    //     switch (customModel.api_format) {
    //         case 'chat_completions':
    //             return await ChatAI.requestChatCompletion({
    //                 url: customModel.url,

    //                 model: customModel.model,
    //                 messages: messages,
    //                 auth: {
    //                     api_key: apiKey as string,
    //                 },

    //                 max_tokens,
    //                 temperature,
    //                 top_p,
    //             });
    //             break;
    //         case 'generative_language':
    //             return await ChatAI.requestGenerativeLanguage({
    //                 url: customModel.url,

    //                 model: customModel.model,
    //                 messages: messages,
    //                 auth: {
    //                     api_key: apiKey as string,
    //                 },

    //                 max_tokens,
    //                 temperature,
    //                 top_p,
    //             });
    //             break;
    //         case 'anthropic_claude':
    //             return await ChatAI.requestAnthropic({
    //                 url: customModel.url,

    //                 model: customModel.model,
    //                 messages: messages,
    //                 auth: {
    //                     api_key: apiKey as string,
    //                 },

    //                 max_tokens,
    //                 temperature,
    //                 top_p,
    //             });
    //         default:
    //             const { rtEventEmitter } = this.nodeData;
    //             rtEventEmitter.emit.error.other(
    //                 [`Fetch Fail : Custom model '${customModel.name}' has unsupported API format '${customModel.api_format}'.`]
    //             );
    //             throw new WorkNodeStop();
    //             break;
    //     }
    // }

    #getAPICategory(model: ChatAIModel): 'known_provider' | 'vertexai' | 'unknown' {
        switch (model.config?.endpoint) {
            case 'chat_completions':
            case 'responses':
            case 'generative_language':
            case 'anthropic':
                return 'known_provider';
            case 'vertexai_gemini':
                return 'vertexai';
            case 'vertexai_claude':
                return 'vertexai';
            default:
                return 'unknown';
        }
    }

    /** 추론 최대 토큰 수를 ChatCompletion의 effort로 변환 */
    #convertThinkingTokenToEffort(thinkingTokens: number) {
        return (
            thinkingTokens <= 1024 ? 'low'
                : thinkingTokens <= 8192 ? 'medium'
                    : 'high'
        );
    }
}

export default ChatAIFetcher;