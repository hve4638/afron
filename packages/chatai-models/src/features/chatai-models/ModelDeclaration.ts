import { ModelListBuilder } from '@/features/model-builder';
import {
    initOpenAIModel,
    initGeminiModel,
    initClaudeModel,
    initVertexAIModel,
} from './modelInitializer';

class ModelDeclaration {
    static #instance: ModelDeclaration;
    #builder: ModelListBuilder;
    #categories: ChatAIModelData;
    #map: Record<string, ChatAIModel>;

    static getInstance() {
        if (!ModelDeclaration.#instance) {
            ModelDeclaration.#instance = new ModelDeclaration();
        }
        return ModelDeclaration.#instance;
    }

    private constructor() {
        this.#builder = new ModelListBuilder();

        this.#load();
        this.#categories = this.#builder.build();
        this.#map = this.#parseMap();
    }

    #load() {
        this.#builder
            .category('openai', 'OpenAI', (c) => initOpenAIModel(c))
            .category('google', 'Gemini', (c) => initGeminiModel(c))
            .category('anthropic', 'Anthropic', (c) => initClaudeModel(c))
            .category('vertexai', 'VertexAI', (c) => initVertexAIModel(c))
    }

    #parseMap(): Record<string, ChatAIModel> {
        const map: Record<string, ChatAIModel> = {};

        for (const category of this.#categories) {
            for (const group of category.groups) {
                for (const model of group.models) {
                    map[model.metadataId] = model;
                }
            }
        }
        return map;
    }

    categories(): ChatAIModelData {
        return this.#categories;
    }

    getModelMap(): Record<string, ChatAIModel> {
        return this.#map;
    }
}

export default ModelDeclaration;