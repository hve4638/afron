import { ChatAIModel, GlobalModelConfiguration } from '@afron/types';

export interface OptionsProps {
    model: ChatAIModel;
    config: Partial<GlobalModelConfiguration>;

    refresh: () => void;
}

