export interface OptionsProps {
    model: ChatAIModel;
    config: Partial<ModelConfiguration>;

    noMarginBottom?: boolean;
    refresh: () => void;
}

