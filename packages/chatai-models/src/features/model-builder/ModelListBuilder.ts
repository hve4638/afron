import CategoryBuilder from './CategoryBuilder';

class ModelListBuilder {
    #categories: CategoryBuilder[] = [];

    category(
        categoryId: string,
        categoryName: string,
        callback: (categoryBuilder: CategoryBuilder) => void
    ): this {
        const categoryBuilder = new CategoryBuilder(categoryId, categoryName);
        callback(categoryBuilder);

        this.#categories.push(categoryBuilder);
        return this;
    }

    build(): ChatAIModelData {
        return this.#categories.map(category => category.build());
    }
}

export default ModelListBuilder;