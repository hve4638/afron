import WorkNode from './WorkNode';
import { ChatAI, ChatAIError } from '@hve/chatai';
import type { ChatAIResult, ChatMessages } from '@hve/chatai';
import { ChatAIModels } from '@afron/chatai-models';
import { WorkNodeStop } from './errors';
import { ProfileAPIKeyControl } from '@/features/profiles/ProfileControl';
import ChatAIFetcher, { ChatAIFetcherFailed } from '@/features/chatai-fetcher';
import { resolveModelConfiguration } from '@/features/model-configuration-resolver';

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
            model, modelConfiguration, auth,
        } = await this.preprocess();

        try {
            return this.fetch({
                model,
                messages,
                modelConfiguration,
                auth,
            });
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
        model: ChatAIModel;
        modelConfiguration: Required<ModelConfiguration>;
        auth: unknown;
    }> {
        const {
            modelId, profile, rtId,
        } = this.nodeData;

        const rt = profile.rt(rtId);
        const { model } = await rt.getPromptMetadata(this.option.promptId ?? 'default');
        const modelConfiguration = resolveModelConfiguration([], [model]);

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
            modelConfiguration,
            auth,
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

    protected async checkResponseOK(chatAIResult: ChatAIResult): Promise<void> {
        const { rtEventEmitter} = this.nodeData;

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