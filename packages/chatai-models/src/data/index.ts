import { ChatAIConfig, ChatAIFlags } from '@afron/types';

export const configFlags = {
    supportThinkingBudget: true,
    supportThinkingEffort: true,
    supportThinkingSummary: true,
    supportVerbosity: true
} satisfies Partial<ChatAIConfig>;

export const flags: Required<ChatAIFlags> = {
    featured: true,
    stable: true,
    latest: true,
    deprecated: true,
    snapshot: true,
    highCost: true,
}