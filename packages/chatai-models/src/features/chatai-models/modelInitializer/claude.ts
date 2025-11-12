import { CategoryBuilder } from '@/features/model-builder';
import { flags } from '@/data';
import { ChatAIConfig } from '@afron/types';

const {
    latest,
    featured,
    deprecated,
    snapshot,
} = flags;


function initProvider(builder: CategoryBuilder) {
    const claudeAPI: Partial<ChatAIConfig> = { endpoint: 'anthropic' };

    builder.group('Claude 4.1', { endpoint: 'anthropic', thinking: 'optional' }, {})
        .model('claude-opus-4-1-20250805', 'Claude Opus 4.1', {}, { latest, featured })

    builder.group('Claude 4', { endpoint: 'anthropic', thinking: 'optional' }, {})
        .model('claude-opus-4-0', 'Claude Opus 4', {}, { latest, featured })
        .model('claude-opus-4-20250514', 'Claude Opus 4 (2025-05-14)', {}, { snapshot })
        .model('claude-sonnet-4-0', 'Claude Sonnet 4', {}, { latest, featured })
        .model('claude-sonnet-4-20250514', 'Claude Sonnet 4 (2025-05-14)', {}, { snapshot });
    
    builder.group('Claude 3.7', { endpoint: 'anthropic', thinking: 'optional' }, {})
        .model('claude-3-7-sonnet-latest', 'Claude Sonnet 3.7', {}, { latest, featured })
        .model('claude-3-7-sonnet-20250219', 'Claude Sonnet 3.7 (2025-02-19)', {}, { snapshot });

    builder.group('Claude 3.5', { endpoint: 'anthropic', }, {})
        .model('claude-3-5-sonnet-latest', 'Claude Sonnet 3.5', {}, { latest, featured })
        .model('claude-3-5-sonnet-20241022', 'Claude Sonnet 3.5 (2024-10-22)', {}, { snapshot })
        .model('claude-3-5-sonnet-20240620', 'Claude Sonnet 3.5 (2024-06-20)', {}, { snapshot })
        .model('claude-3-5-haiku-latest', 'Claude Haiku 3.5', {}, { featured, latest })
        .model('claude-3-5-haiku-20241022', 'Claude Haiku 3.5 (2024-10-22)', {}, { snapshot });

    builder.group('Claude 3', claudeAPI, {})
        .model('claude-3-opus-latest', 'Claude Opus 3', {}, { latest, featured })
        .model('claude-3-opus-20240229', 'Claude Opus 3 (2024-02-29)', {}, { snapshot })
        .model('claude-3-sonnet-20240229', 'Claude Sonnet 3 (2024-02-29)', {}, { latest, snapshot })
        .model('claude-3-haiku-20240307', 'Claude Haiku 3 (2024-03-07)', {}, { latest, snapshot });
}

export default initProvider;