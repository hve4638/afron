import WorkNode from './WorkNode';
import { ChatAI, ChatAIError } from '@hve/chatai';
import type { ChatAIResult, ChatMessages } from '@hve/chatai';
import { ChatAIModels } from '@afron/chatai-models';
import { WorkNodeStop } from './errors';
import { ProfileAPIKeyControl } from '@/features/profiles/ProfileControl';
import ChatAIFetcher from '@/features/chatai-fetcher';

type ChatAIPreviewNodeInput = {
    messages: ChatMessages;
}
type ChatAIPreviewNodeOutput = {
    result: ChatAIResult;
}
type ChatAIFetchNodeOption = {
    promptId: string;
}

class ChatAIPreviewNode extends WorkNode<ChatAIPreviewNodeInput, ChatAIPreviewNodeOutput, ChatAIFetchNodeOption> {
    async process(
        { messages }: ChatAIPreviewNodeInput,
    ): Promise<ChatAIPreviewNodeOutput> {
        const { rtEventEmitter } = this.nodeData;
        const fetcher = new ChatAIFetcher(this.logger);
        const {
            modelId, profile, rtId,
        } = this.nodeData;

        const rt = profile.rt(rtId);

        try {
            const result = await this.request(messages);

            if (!result.response.ok) {
                this.logger.error(
                    `ChatAI Fetch Error: ${result.response.http_status} - ${result.response.http_status_text}`,
                    result.response.raw
                );
                rtEventEmitter.emit.error.httpError(
                    result.response.http_status,
                    [JSON.stringify(result.response.raw, null, 2)]
                );
                throw new WorkNodeStop();
            }

            this.logger.debug(
                `ChatAIFetchNode Result:`,
                result.response.raw
            );

            return {
                result: result,
            };
        }
        catch (e) {
            if (e instanceof ChatAIError) {
                rtEventEmitter.emit.error.fetchFailed(
                    [e.message]
                );
            }
            else if (e instanceof WorkNodeStop) {
                // nothing to do
            }
            else if (e instanceof Error) {
                this.logger.error(
                    `ChatAIFetchNode Error: ${e.message}`,
                    e
                );
                rtEventEmitter.emit.error.fetchFailed(
                    [e.message]
                );
            }
            else {
                rtEventEmitter.emit.error.other(
                    [e instanceof Error ? e.message : String(e)],
                );
            }
            throw new WorkNodeStop();
        }
    }

    protected async preprocess(): Promise<{ model: ChatAIModel; modelConfiguration: Required<ModelConfiguration>; }> {
        const {
            modelId, profile, rtId,
        } = this.nodeData;

        const rt = profile.rt(rtId);
        const { model } = await rt.getPromptMetadata(this.option.promptId ?? 'default');
        const modelConfiguration: Required<ModelConfiguration> = {
            max_tokens: model.max_tokens ?? 4096,
            temperature: model.temperature ?? 0.7,
            top_p: model.top_p ?? 1.0,
            use_thinking: model.use_thinking ?? false,
            thinking: model.thinking ?? 'optional',
            thinking_max_tokens: model.thinking_max_tokens ?? 1024,
            thinking_tokens: model.thinking_tokens ?? 512,
            thinking_effort: model.thinking_effort ?? 'medium',
        }
        // resolveModelConfiguration

        const modelMap = ChatAIModels.getModelMap();
        const modelData = modelMap[modelId];

        const apiName = this.#getAPIName(modelData);

        let auth: unknown;
        if (apiName) {
            const profileAPIKeyControl = new ProfileAPIKeyControl(profile);
            auth = await profileAPIKeyControl.nextAPIKey(apiName);
        }
        else {
            auth = null;
        }

        return {
            model: modelData,
            modelConfiguration: model,
        }
    }

    protected async fetch({
        model,
        messages,
        modelConfiguration,
        auth,
    }: {
        model: ChatAIModel,
        messages: ChatMessages,
        modelConfiguration: Required<ModelConfiguration>,
        auth: undefined,
    }) {
        const fetcher = new ChatAIFetcher(this.logger);

        fetcher.request({
            model: model,
            messages: messages,
            modelConfiguration,
            auth,
        }, { previewMode: true });
    }

    async #request() {
        const {
            modelId, rtEventEmitter, profile, rtId,
        } = this.nodeData;



        const rt = profile.rt(rtId);
        const { model } = await rt.getPromptMetadata(this.option.promptId ?? 'default');

        const modelMap = ChatAIModels.getModelMap();
        const modelData = modelMap[modelId];
        if (modelData) {
            const fetcher = new ChatAIFetcher(this.logger);
            fetcher.request({
                model: modelData,
                messages: [],
                auth: ProfileAPIKeyControl.getAuth(profile, modelData.auth),
                modelConfiguration,
            }, { previewMode: true });
            return await this.requestDefinedModel(modelData, model, messages);
        }
        else if (modelId.startsWith('custom:')) {
            const dataAC = await profile.accessAsJSON('data.json');
            const customModels: CustomModel[] = dataAC.getOne('custom_models');
            const customModel = customModels.find(m => m.id === modelId);

            if (customModel) {
                return await this.requestCustomModel(customModel, model, messages);
            }
        }
        rtEventEmitter.emit.error.other([
            `Unknown model: ${modelId}`
        ]);
        throw new WorkNodeStop();
    }

    private async request(messages: ChatMessages) {
        const {
            modelId, rtEventEmitter, profile, rtId,
        } = this.nodeData;

        const rt = profile.rt(rtId);
        // @TODO : 'default'로 임시 하드코딩
        // flow모드 구현 시 수정 필요
        const { model } = await rt.getPromptMetadata('default');

        const modelMap = ChatAIModels.getModelMap();
        const modelData = modelMap[modelId];
        if (modelData) {
            return await this.requestDefinedModel(modelData, model, messages);
        }
        else if (modelId.startsWith('custom:')) {
            const dataAC = await profile.accessAsJSON('data.json');
            const customModels: CustomModel[] = dataAC.getOne('custom_models');
            const customModel = customModels.find(m => m.id === modelId);

            if (customModel) {
                return await this.requestCustomModel(customModel, model, messages);
            }
        }

        rtEventEmitter.emit.error.other([
            `Unknown model: ${modelId}`
        ]);
        throw new WorkNodeStop();
    }

    #getAPIName(model: ChatAIModel): 'openai' | 'anthropic' | 'google' | 'vertexai' | null {
        switch (model.config?.endpoint) {
            case 'chat_completions':
            case 'responses':
                return 'openai';
            case 'generative_language':
                return 'google';
            case 'anthropic':
                return 'anthropic';
            case 'vertexai_gemini':
                return 'vertexai';
            case 'vertexai_claude':
                return 'vertexai';
            default:
                return null;
        }
    }
}

export default ChatAIPreviewNode;