import BaseFormBuilder from './BaseFormBuilder';
import { FormBuilderProps } from './types';

class VertexAIFormBuilder extends BaseFormBuilder {
    constructor(props: FormBuilderProps) {
        super(props);
    }

    override build() {
        const base = this.getBase();

        return {
            ...base,

            thinking_tokens: (
                this.isThinkingEnabled()
                    ? this.modelConfig.thinking_tokens
                    : undefined
            ),
        }
    }
}


export default VertexAIFormBuilder;