export interface OptionsProps {
    model: ChatAIModel;
    config: Partial<ModelConfiguration>;
    refresh: () => void;
}

