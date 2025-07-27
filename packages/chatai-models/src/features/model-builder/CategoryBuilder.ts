import GroupBuilder from './GroupBuilder';

class CategoryBuilder {
    #id: string;
    #name: string;
    #groups: GroupBuilder[];

    constructor(categoryId: string, categoryName: string) {
        this.#id = categoryId;
        this.#name = categoryName;
        this.#groups = [];
    }

    group(groupName: string, baseModelConfig: Partial<ChatAIConfig> = {}, baseModelFlags: ChatAIFlags = {}): GroupBuilder {
        const group = new GroupBuilder(groupName, {
            categoryId: this.#id,
            baseModelConfig,
            baseModelFlags
        });

        this.#groups.push(group);
        return group;
    }

    build(): ChatAIModelCategory {
        return {
            categoryId: this.#id,
            categoryName: this.#name,
            groups: this.#groups.map(g => g.build()),
        }
    }
}

export default CategoryBuilder;