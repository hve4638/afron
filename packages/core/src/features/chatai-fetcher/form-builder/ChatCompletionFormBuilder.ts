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
            thinking_effort: (
                this.isThinkingEnabled()
                    ? this.modelConfig.thinking_effort
                    : undefined
            ),
            verbosity: (
                this.isVerbosity()
                    ? this.modelConfig.verbosity
                    : undefined
            )
        }
    }

    protected isVerbosity() {
        return (
            this.modelInfo.supportVerbosity
        );
    }
}


export default ChatCompletionFormBuilder;