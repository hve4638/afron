declare global {
    type FlowNodeType = (
        'input'
        | 'output'
        | 'prompt-template'
        | 'llm-fetch'
    );
}

export {};