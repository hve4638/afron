import type { ChatAIResult, ChatMessages } from '@hve/chatai';
import ChatAIFetcher from '@/features/chatai-fetcher';

import ChatAIFetchNode from './ChatAIFetchNode';

class ChatAIPreviewNode extends ChatAIFetchNode {
    override async fetch({
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
        }, { preview: true });
    }
}

export default ChatAIPreviewNode;