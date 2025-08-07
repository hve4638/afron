export interface OptionsProps {
    model: ChatAIModel;
    config: Partial<GlobalModelConfiguration>;

    refresh: () => void;
}

