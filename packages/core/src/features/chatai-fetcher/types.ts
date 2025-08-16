import { ChatAI, ChatMessages } from '@hve/chatai';

export type ChatAIRequestAPI = typeof ChatAI.request | typeof ChatAI.previewRequest;
export type ChatAIStreamAPI = typeof ChatAI.stream;

export type RequestModelProps<TAuth = unknown> = {
    model: ChatAIModel;
    modelConfiguration: Required<ModelConfiguration>;
    messages: ChatMessages;
    auth: TAuth;
    api: ChatAIRequestAPI;
}
export type RequestCustomModelProps<TAuth = unknown> = {
    model: CustomModel;
    modelConfiguration: Required<ModelConfiguration>;
    messages: ChatMessages;
    auth: TAuth;
    api: ChatAIRequestAPI;
}