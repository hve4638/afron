export const HandleTypes = {
    LLMResult: 'LLMResult',

    Input: 'Input',
    Output: 'Output',

    ChatMessages: 'ChatMessages',
} as const;
export type HandleType = typeof HandleTypes[keyof typeof HandleTypes];

export const HandleColors: Record<HandleType, string> = {
    [HandleTypes.LLMResult]: '#10b981',    // green
    [HandleTypes.Input]: '#3b82f6',        // blue
    [HandleTypes.Output]: '#f59e0b',       // amber
    [HandleTypes.ChatMessages]: '#8b5cf6', // purple
};

