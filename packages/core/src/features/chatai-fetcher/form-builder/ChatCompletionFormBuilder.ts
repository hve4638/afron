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
            // @hve/chatai 0.16.0 타입에 'xhigh'가 아직 없으나 값은 reasoning_effort로 그대로 전달되므로 안전.
            // 라이브러리 타입 갱신 후 캐스트 제거
            thinking_effort: (
                this.isThinkingEnabled()
                    ? this.modelConfig.thinking_effort as Exclude<typeof this.modelConfig.thinking_effort, 'xhigh'>
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