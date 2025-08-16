import BaseFormBuilder from './BaseFormBuilder';
import { FormBuilderProps } from './types';

class ResponsesFormBuilder extends BaseFormBuilder {
    constructor(props: FormBuilderProps) {
        super(props);
    }

    override build() {
        const form = this.getBase();
        const thinking_effort = this.modelConfig.thinking_effort;

        return {
            ...form,
            thinking_effort,
        }
    }
}


export default ResponsesFormBuilder;