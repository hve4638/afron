import { FormBuilderProps } from './types';
import BaseFormBuilder from './BaseFormBuilder';
import GeminiFormBuilder from './GeminiFormBuilder';
import ChatCompletionFormBuilder from './ChatCompletionFormBuilder';
import ResponsesFormBuilder from './ResponsesFormBuilder';
import AnthropicFormBuilder from './AnthropicFormBuilder';
import VertexAIFormBuilder from './VertexAIFormBuilder';

// 각 FormBuilder의 Facade
class FormBuilder {
    constructor(private props: FormBuilderProps) {
        this.props = props;
    }

    base() {
        const formBuilder = new BaseFormBuilder(this.props);

        return formBuilder.build();
    }

    generativeLanguage() {
        const formBuilder = new GeminiFormBuilder(this.props);

        return formBuilder.build();
    }

    chatCompletion() {
        const formBuilder = new ChatCompletionFormBuilder(this.props);

        return formBuilder.build();
    }

    responses() {
        const formBuilder = new ResponsesFormBuilder(this.props);

        return formBuilder.build();
    }

    anthropic() {
        const formBuilder = new AnthropicFormBuilder(this.props);

        return formBuilder.build();
    }

    vertexAI() {
        const formBuilder = new VertexAIFormBuilder(this.props);

        return formBuilder.build();
    }
}

export default FormBuilder;