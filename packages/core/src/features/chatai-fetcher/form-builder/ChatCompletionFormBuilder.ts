import BaseFormBuilder from './BaseFormBuilder';
import { FormBuilderProps } from './types';

class ChatCompletionFormBuilder extends BaseFormBuilder {
    constructor(props: FormBuilderProps) {
        super(props);
    }

    override build() {
        const form = this.getBase();
        
        return {
            ...form,
            thinking_tokens: (
                this.isThinkingEnabled()
                    ? this.modelConfig.thinking_tokens
                    : undefined
            ),

            safety_settings: this.modelConfig.safety_settings,
        }
    }
}


export default ChatCompletionFormBuilder;