import { ChatMessages } from '@hve/chatai';
import GeminiFormBuilder from './GeminiFormBuilder';
import { ChatAIConfig, ModelConfiguration } from '@afron/types';

export interface FormBuilderProps {
    modelId: string;
    modelConfig: Required<ModelConfiguration>;
    modelInfo: ChatAIConfig;
    messages: ChatMessages;
}