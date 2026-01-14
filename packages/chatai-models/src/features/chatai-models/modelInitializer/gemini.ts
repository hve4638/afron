import { CategoryBuilder } from '@/features/model-builder';
import { flags } from '@/data';
import { ChatAIConfig } from '@afron/types';

const {
    latest,
    featured,
    deprecated,
    snapshot,
} = flags;

// Gemini Models 목록
// https://ai.google.dev/gemini-api/docs/models?hl=ko
function initProvider(builder: CategoryBuilder) {
    const genAPI: Partial<ChatAIConfig> = {
        endpoint: 'generative_language',
        supportGeminiSafetyFilter: true,
        supportThinkingBudget: true,
    };

    builder.group('Gemini 3.0', genAPI, {})
        .model('gemini-3-pro-preview', 'Gemini 3.0 Pro (preview)', { thinking: 'enabled' }, { latest, featured })
        .model('gemini-3-flash-preview', 'Gemini 3.0 Flash (preview)', { thinking: 'enabled' }, { latest, featured })
        // .model('gemini-3-pro-image-preview', 'Gemini 3.0 Pro Image Preview', { thinking: 'enabled' }, { latest, featured })

    builder.group('Gemini 2.5', genAPI, {})
        .model('gemini-2.5-pro', 'Gemini 2.5 Pro', { thinking: 'enabled', }, { latest, featured })
        .model('gemini-2.5-pro-preview-06-05', 'Gemini 2.5 Pro Preview (2025-06-05)', {}, { deprecated })
        .model('gemini-2.5-flash', 'Gemini 2.5 Flash', { thinking: 'optional', thinkingDisableStrategy: 'set_to_zero' }, { latest, featured })
        .model('gemini-2.5-flash-preview-05-20', 'Gemini 2.5 Flash Preview (2025-05-20)', {}, { deprecated });

    builder.group('Gemini 2.0', genAPI, {})
        .model('gemini-2.0-flash', 'Gemini 2.0 Flash', {}, { latest, featured })
        .model('gemini-2.0-flash-001', 'Gemini 2.0 Flash 001', {}, { snapshot })
        .model('gemini-2.0-flash-exp', 'Gemini 2.0 Flash Exp', {}, {})
        .model('gemini-2.0-flash-lite', 'Gemini 2.0 Flash-Lite', {}, { latest, featured })
        .model('gemini-2.0-flash-lite-001', 'Gemini 2.0 Flash-Lite 001', {}, { snapshot });

    builder.group('Gemini 1.5', genAPI, {})
        .model('gemini-1.5-pro-latest', 'Gemini 1.5 Pro (latest)', {}, { latest, featured })
        .model('gemini-1.5-pro', 'Gemini 1.5 Pro (stable)', {}, {})
        .model('gemini-1.5-pro-002', 'Gemini 1.5 Pro 002', {}, { snapshot })
        .model('gemini-1.5-pro-001', 'Gemini 1.5 Pro 001', {}, { snapshot })
        .model('gemini-1.5-flash-latest', 'Gemini 1.5 Flash (latest)', {}, { latest, featured })
        .model('gemini-1.5-flash', 'Gemini 1.5 Flash (stable)', {}, {})
        .model('gemini-1.5-flash-002', 'Gemini 1.5 Flash 002', {}, { snapshot })
        .model('gemini-1.5-flash-001', 'Gemini 1.5 Flash 001', {}, { snapshot })
        .model('gemini-1.5-flash-8b-latest', 'Gemini 1.5 Flash 8B (latest)', {}, { latest, featured })
        .model('gemini-1.5-flash-8b', 'Gemini 1.5 Flash 8B (stable)', {}, {})
        .model('gemini-1.5-flash-8b-001', 'Gemini 1.5 Flash 8B 001', {}, { snapshot });
}

export default initProvider;