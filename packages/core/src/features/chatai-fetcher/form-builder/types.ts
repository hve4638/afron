import { ChatMessages } from '@hve/chatai';
import GeminiFormBuilder from './GeminiFormBuilder';

export interface FormBuilderProps {
    modelId: string;
    modelConfig: Required<ModelConfiguration>;
    modelInfo: ChatAIConfig;
    messages: ChatMessages;
}