export interface OptionsProps {
    model: ChatAIModel;
    config: Partial<GlobalModelConfiguration>;

    noMarginBottom?: boolean;
    refresh: () => void;
}

