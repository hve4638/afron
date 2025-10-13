import WorkNode from './WorkNode';
import { ChatAI, ChatAIError } from '@hve/chatai';
import type { ChatAIResult, ChatMessages } from '@hve/chatai';
import { ChatAIModels } from '@afron/chatai-models';
import { WorkNodeStop } from './errors';
import { ProfileAPIKeyControl } from '@/features/profiles/ProfileControl';
import ChatAIFetcher, { ChatAIFetcherFailed } from '@/features/chatai-fetcher';
import { resolveModelConfiguration } from '@/features/model-metadata-resolver';
import { ChatAIModel, CustomModel, ModelConfiguration } from '@afron/types';

type ChatAIFetchNodeInput = {
    messages: ChatMessages;
}
type ChatAIFetchNodeOutput = {
    result: ChatAIResult;
}
type ChatAIFetchNodeOption = {
    promptId: string;
}

class ChatAIFetchNode extends WorkNode<ChatAIFetchNodeInput, ChatAIFetchNodeOutput, ChatAIFetchNodeOption> {
    async process(
        { messages }: ChatAIFetchNodeInput,
    ): Promise<ChatAIFetchNodeOutput> {
        const { rtEventEmitter } = this.nodeData;

        try {
            const result = await this.#request({ messages });

            rtEventEmitter.emit.send.info('fetch response', 'click to view', [
                { name: 'Response', value: JSON.stringify(result, null, 2) },
            ]);
            this.checkResponseOK(result);

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

    async #request({ messages }: { messages: ChatMessages }) {
        const {
            modelId, rtEventEmitter, profile, rtId,
        } = this.nodeData;
        const {
            useCustomModel,
            model, modelConfiguration, auth,
        } = await this.preprocess();

        try {
            if (useCustomModel) {
                return this.fetchCustom({
                    model,
                    messages,
                    modelConfiguration,
                    auth,
                });
            }
            else {
                return this.fetch({
                    model,
                    messages,
                    modelConfiguration,
                    auth,
                });
            }
        }
        catch (e) {
            if (e instanceof ChatAIFetcherFailed) {
                rtEventEmitter.emit.error.other([
                    `${e}`
                ]);
            }
            else {
                rtEventEmitter.emit.error.other([
                    `exception occured: ${modelId}`
                ]);
            }
            throw new WorkNodeStop();
        }
    }

    protected async preprocess(): Promise<{
        useCustomModel: true;
        model: CustomModel;
        modelConfiguration: Required<ModelConfiguration>;
        auth: unknown;
    } | {
        useCustomModel: false;
        model: ChatAIModel;
        modelConfiguration: Required<ModelConfiguration>;
        auth: unknown;
    }> {
        const {
            modelId, profile, rtId,
            rtEventEmitter,
        } = this.nodeData;

        const rt = profile.rt(rtId);

        const globalConfig = await profile.model.getGlobalModelConfig(modelId);

        const { model } = await rt.getPromptMetadata(this.option.promptId ?? 'default');
        const modelConfiguration = resolveModelConfiguration([globalConfig], [model]);

        if (modelId.startsWith('custom:')) {
            const result = await this.#getCustomModelAndAuth(modelId);

            if (!result) {
                rtEventEmitter.emit.error.other([`ChatAIFetchNode: Model '${modelId}' not found.`]);
                this.logger.error(`ChatAIFetchNode: Model '${modelId}' not found.`);
                throw new WorkNodeStop();
            }

            return {
                useCustomModel: true,
                model: result.model,
                auth: result.auth,
                modelConfiguration,
            }
        }
        else {
            const result = await this.#getModelAndAuth(modelId);

            if (!result) {
                rtEventEmitter.emit.error.other([`ChatAIFetchNode: Model '${modelId}' not found.`]);
                this.logger.error(`ChatAIFetchNode: Model '${modelId}' not found.`);
                throw new WorkNodeStop();
            }
            if (!result) {
                rtEventEmitter.emit.error.other([`ChatAIFetchNode: Model '${modelId}' not found.`]);
                this.logger.error(`ChatAIFetchNode: Model '${modelId}' not found.`);
                throw new WorkNodeStop();
            }

            return {
                useCustomModel: false,
                model: result.model,
                auth: result.auth,
                modelConfiguration,
            }
        }
    }

    async #getModelAndAuth(modelId: string): Promise<{ model: ChatAIModel; auth: unknown; } | null> {
        const { profile } = this.nodeData;
        const profileAPIKeyControl = new ProfileAPIKeyControl(profile);

        const modelMap = ChatAIModels.getModelMap();
        const model = modelMap[modelId];

        if (model != undefined) {
            const apiName = this.#getAPIName(model);

            if (apiName) {
                const auth = await profileAPIKeyControl.nextAPIKey(apiName);
                return { model, auth };
            }
        }

        return null;
    }

    async #getCustomModelAndAuth(customModelId: string): Promise<{ model: CustomModel; auth: unknown; } | null> {
        const { profile } = this.nodeData;

        const dataAC = await profile.accessAsJSON('data.json');
        const models: CustomModel[] = dataAC.getOne('custom_models');
        const model = models.find(m => m.id === customModelId);
        
        if (model == null) return null;
        let auth: unknown = null;

        const authControl = new ProfileAPIKeyControl(profile);
        if (model.secret_key) {
            auth = await authControl.getAuth(model.secret_key);
        }

        return { model, auth }
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
        auth: unknown,
    }): Promise<ChatAIResult> {
        const fetcher = new ChatAIFetcher(this.logger);

        return fetcher.request({
            model: model,
            messages: messages,
            modelConfiguration,
            auth,
        }, {});
    }

    protected async fetchCustom({
        model,
        messages,
        modelConfiguration,
        auth,
    }: {
        model: CustomModel,
        messages: ChatMessages,
        modelConfiguration: Required<ModelConfiguration>,
        auth: unknown,
    }): Promise<ChatAIResult> {
        const fetcher = new ChatAIFetcher(this.logger);

        return fetcher.requestCustom({
            model: model,
            messages: messages,
            modelConfiguration,
            auth,
        }, {});
    }

    protected async checkResponseOK(chatAIResult: ChatAIResult): Promise<void> {
        const { rtEventEmitter } = this.nodeData;

        if (!chatAIResult.response.ok) {
            this.logger.error(
                `ChatAI Fetch Error: ${chatAIResult.response.http_status} - ${chatAIResult.response.http_status_text}`,
                chatAIResult.response.raw
            );
            rtEventEmitter.emit.error.httpError(
                chatAIResult.response.http_status,
                [JSON.stringify(chatAIResult.response.raw, null, 2)]
            );
            throw new WorkNodeStop();
        }
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

export default ChatAIFetchNode;