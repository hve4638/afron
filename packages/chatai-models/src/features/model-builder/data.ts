import { ChatAIConfig, SupportedThinkingEfforts, SupportedVerbosity } from "@afron/types";

export const DEFAULT_CHATAI_CONFIG = {
    allowStream: false,
    allowFunctionCall: false,
    allowStructuredOutput: false,
    allowCaching: false,

    supportGeminiSafetyFilter: false,
    supportThinkingBudget: false,
    supportThinkingEffort: false,
    supportThinkingSummary: false,
    supportVerbosity: false,

    vertexAILocation: 'global',

    supportedThinkingEfforts: ['low', 'medium', 'high'] as readonly SupportedThinkingEfforts[],
    supportedVerbosity: ['low', 'medium', 'high'] as readonly SupportedVerbosity[],
    thinkingDisableStrategy: 'omit',
} satisfies ChatAIConfig;

export type DefaultChatAIConfig = typeof DEFAULT_CHATAI_CONFIG;