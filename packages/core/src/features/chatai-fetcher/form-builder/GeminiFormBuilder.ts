import BaseFormBuilder from './BaseFormBuilder';
import { FormBuilderProps } from './types';

class GeminiFormBuilder extends BaseFormBuilder {
    constructor(props: FormBuilderProps) {
        super(props);
    }

    override build() {
        const form = this.getBase();

        let thinking_tokens = this.getThinkingToken();
        return {
            ...form,
            thinking_tokens,

            safety_settings: this.modelConfig.safety_settings,
        }
    }
}


export default GeminiFormBuilder;