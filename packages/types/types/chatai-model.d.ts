declare global {
    type ChatAIFlags = {
        featured?: boolean;
        stable?: boolean;
        latest?: boolean;
        deprecated?: boolean;
        snapshot?: boolean;
        highCost?: boolean;
    }
    type ChatAIConfig = {
        tokenizer?: 'default';

        thinking?: 'enabled' | 'optional' | 'disabled';
        cache?: true;

        allowStream?: true;
        allowFunctionCall?: true;
        allowStructuredOutput?: true;

        endpoint?: 'chat_completions' | 'responses' | 'generative_language' | 'anthropic' | 'vertexai_gemini' | 'vertexai_claude';
        customEndpoint?: string;
    }

    type ChatAIModel = {
        metadataId: string;
        modelId: string;
        displayName: string;

        config: ChatAIConfig;
        flags: ChatAIFlags;
    }
    
    type ChatAIModelGroup = {
        groupName: string;

        models: Array<ChatAIModel>;
    }
    
    type ChatAIModelCategory = {
        categoryId: string;
        categoryName: string;

        groups: Array<ChatAIModelGroup>;
    }

    type ChatAIModelData = Array<ChatAIModelCategory>
}

export { };