import { flags, configFlags } from '@/data';
import { CategoryBuilder } from '@/features/model-builder';

const {
    supportThinkingEffort,
    supportVerbosity
} = configFlags;

const {
    latest,
    featured,
    deprecated,
    snapshot,
} = flags;

function initProvider(builder: CategoryBuilder) {
    const completionsAPI: Partial<ChatAIConfig> = { endpoint: 'chat_completions' };
    const resAPI: Partial<ChatAIConfig> = { endpoint: 'responses' };

    builder.group('GPT-5', {
        endpoint: 'chat_completions',
        thinking: 'enabled',
        supportThinkingEffort,
        supportVerbosity,

        supportedThinkingEfforts: ['minimal', 'low', 'medium', 'high'],
        supportedVerbosity: ['low', 'medium', 'high'],
    }, {})
        .model('gpt-5-chat-latest', 'GPT-5 Chat', {
            supportThinkingEffort: undefined,
            supportVerbosity: undefined,
        }, { latest, featured })
        .model('gpt-5', 'GPT-5', {}, { latest, featured })
        .model('gpt-5-2025-08-07', 'GPT-5 (2025-08-07)', {}, { snapshot })
        .model('gpt-5-mini', 'GPT-5 mini', {}, { latest, featured })
        .model('gpt-5-mini-2025-08-07', 'GPT-5 mini (2025-08-07)', {}, { snapshot })
        .model('gpt-5', 'GPT-5 nano', {}, { latest, featured })
        .model('gpt-5-nano-2025-08-07', 'GPT-5 nano (2025-08-07)', {}, { snapshot })

    builder.group('ChatGPT-4o', completionsAPI, {})
        .model('chatgpt-4o-latest', 'ChatGPT 4o', {}, { latest, featured })

    builder.group('GPT-4o', completionsAPI, {})
        .model('gpt-4o', 'GPT 4o', {}, { latest, featured })
        .model('gpt-4o-2024-11-20', 'GPT 4o (2024-11-20)', {}, { snapshot })
        .model('gpt-4o-2024-08-06', 'GPT 4o (2024-08-06)', {}, { snapshot })
        .model('gpt-4o-2024-05-13', 'GPT 4o (2024-05-13)', {}, { snapshot })
        .model('gpt-4o-mini', 'GPT 4o mini', {}, { latest, featured })
        .model('gpt-4o-mini-2024-07-18', 'GPT 4o mini (2024-07-18)', {}, { snapshot });

    builder.group('GPT-4.1', completionsAPI, {})
        .model('gpt-4.1', 'GPT 4.1', {}, { latest, featured })
        .model('gpt-4.1-2025-04-14', 'GPT 4.1 (2025-04-14)', {}, { snapshot })
        .model('gpt-4.1-mini', 'GPT 4.1 mini', {}, { latest, featured })
        .model('gpt-4.1-mini-2025-04-14', 'GPT 4.1 mini (2025-04-14)', {}, { snapshot })
        .model('gpt-4.1-nano', 'GPT 4.1 nano', {}, { latest })
        .model('gpt-4.1-nano-2025-04-14', 'GPT 4.1 nano (2025-04-14)', {}, { snapshot });


    const supportedThinkingEfforts: SupportedThinkingEfforts[] = ['minimal', 'low', 'medium', 'high'];
    builder.group('o4', {
        endpoint: 'responses',
        thinking: 'enabled',
        supportThinkingEffort,
        supportedThinkingEfforts
    }, {})
        .model('o4-mini', 'o4 mini', {}, { latest, featured })
        .model('o4-mini-2025-04-16', 'o4 mini (2025-04-16)', {}, { snapshot });

    builder.group('o3', {
        thinking: 'enabled',
        supportedThinkingEfforts
    }, {})
        .model('o3', 'o3', completionsAPI, { latest, featured })
        .model('o3-2025-04-16', 'o3 (2025-04-16)', completionsAPI, { snapshot })
        .model('o3-mini', 'o3 mini', resAPI, { latest, featured })
        .model('o3-mini-2025-01-31', 'o3 mini (2025-01-31)', resAPI, { snapshot });

    builder.group('o1', {
        thinking: 'enabled',
        supportedThinkingEfforts
    }, {})
        .model('o1', 'o1', resAPI, { latest, featured })
        .model('o1-2024-12-17', 'o1 (2024-12-17)', resAPI, { snapshot })
        .model('o1-pro', 'o1 pro', resAPI, { latest, featured })
        .model('o1-pro-2025-03-19', 'o1 pro (2025-03-19)', resAPI, { snapshot })
        .model('o1-mini', 'o1 mini', completionsAPI, { latest, featured })
        .model('o1-mini-2024-09-12', 'o1 mini (2024-09-12)', completionsAPI, { snapshot })
        .model('o1-preview', 'o1 preview', completionsAPI, { latest })
        .model('o1-preview-2024-09-12', 'o1 preview (2024-09-12)', completionsAPI, { snapshot });

    builder.group('GPT-4', completionsAPI, { deprecated })
        .model('gpt-4-turbo', 'GPT 4 Turbo', {}, { latest })
        .model('gpt-4-turbo-2024-04-09', 'GPT 4 Turbo (2024-04-09)', {}, { snapshot })
        .model('gpt-4', 'GPT 4', {}, { latest })
        .model('gpt-4-0125-preview', 'GPT 4 (0125-preview)', {}, { snapshot })
        .model('gpt-4-1106-preview', 'GPT 4 (1106-preview)', {}, { snapshot })
        .model('gpt-4-0613', 'GPT 4 (0613)', {}, { snapshot })
        .model('gpt-4-0314', 'GPT 4 (0314)', {}, { snapshot })

    builder.group('GPT-3.5', completionsAPI, { deprecated })
        .model('gpt-3.5-turbo', 'GPT 3.5 Turbo', {}, { latest })
        .model('gpt-3.5-turbo-0125', 'GPT 3.5 Turbo (0125)', {}, { snapshot })
        .model('gpt-3.5-turbo-1106', 'GPT 3.5 Turbo (1106)', {}, { snapshot })
        .model('gpt-3.5-turbo-instruct', 'GPT 3.5 Turbo Instruct', {}, { latest });
}
export default initProvider;