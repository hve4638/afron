import { ChatAIConfig, ChatAIFlags, ChatAIModel, ChatAIModelGroup } from "@afron/types";

interface GroupBuilderOptions {
    categoryId: string;
    baseModelConfig: ChatAIConfig;
    baseModelFlags: ChatAIFlags;
}

class GroupBuilder {
    #name: string;
    #categoryId: string;
    #baseModelConfig: ChatAIConfig;
    #baseModelFlags: ChatAIFlags;
    #models: ChatAIModel[];

    constructor(groupName: string, { categoryId, baseModelConfig, baseModelFlags }: GroupBuilderOptions) {
        this.#name = groupName;
        this.#categoryId = categoryId;
        this.#baseModelConfig = baseModelConfig;
        this.#baseModelFlags = baseModelFlags;
        this.#models = [];
    }

    model(
        id: string,
        name: string,
        config: Partial<ChatAIConfig>,
        flags: ChatAIFlags,
    ) {
        const model: ChatAIModel = {
            metadataId: this.#categoryId + ':' + id,
            modelId: id,
            displayName: name,
            config: {
                ...this.#baseModelConfig,
                ...config,
            },
            flags: {
                ...this.#baseModelFlags,
                ...flags,
            },
        };
        this.#models.push(model);
        return this;
    }

    build(): ChatAIModelGroup {
        return {
            groupName: this.#name,
            models: this.#models,
        }
    }
}

export default GroupBuilder;