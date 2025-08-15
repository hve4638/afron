export function getAPICategory(model: ChatAIModel): 'known_provider' | 'vertexai' | null {
    switch (model.config?.endpoint) {
        case 'chat_completions':
        case 'responses':
        case 'generative_language':
        case 'anthropic':
            return 'known_provider';
        case 'vertexai_gemini':
        case 'vertexai_claude':
            return 'vertexai';
        default:
            return null;
    }
}

export function convertThinkingBudgetToEffort(thinkingBudget: number): 'low' | 'medium' | 'high' {
    return (
        thinkingBudget <= 1024 ? 'low'
            : thinkingBudget <= 8192 ? 'medium'
                : 'high'
    );
}