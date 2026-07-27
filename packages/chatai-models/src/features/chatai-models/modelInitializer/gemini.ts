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

    builder.group('Gemini 3.6', genAPI, {})
        .model('gemini-3.6-flash', 'Gemini 3.6 Flash', { thinking: 'enabled' }, { latest, featured })

    builder.group('Gemini 3.5', genAPI, {})
        .model('gemini-3.5-flash', 'Gemini 3.5 Flash', { thinking: 'enabled' }, { latest, featured })
        .model('gemini-3.5-flash-lite', 'Gemini 3.5 Flash-Lite', { thinking: 'enabled' }, { latest, featured })

    builder.group('Gemini 3.1', genAPI, {})
        .model('gemini-3.1-pro-preview', 'Gemini 3.1 Pro (preview)', { thinking: 'enabled' }, { latest, featured })
        .model('gemini-3.1-flash-lite', 'Gemini 3.1 Flash-Lite', { thinking: 'enabled' }, { latest, featured })

    builder.group('Gemini 3.0', genAPI, {})
        // gemini-3-pro-preview: 2026-03-09 deprecated, alias가 gemini-3.1-pro-preview로 리다이렉트됨
        .model('gemini-3-pro-preview', 'Gemini 3.0 Pro (preview)', { thinking: 'enabled' }, { deprecated })
        .model('gemini-3-flash-preview', 'Gemini 3.0 Flash (preview)', { thinking: 'enabled' }, { latest, featured })
        // .model('gemini-3-pro-image-preview', 'Gemini 3.0 Pro Image Preview', { thinking: 'enabled' }, { latest, featured })

    // Gemini 2.5: 2026-10-16 종료 예정
    builder.group('Gemini 2.5', genAPI, {})
        .model('gemini-2.5-pro', 'Gemini 2.5 Pro', { thinking: 'enabled', }, { deprecated })
        .model('gemini-2.5-pro-preview-06-05', 'Gemini 2.5 Pro Preview (2025-06-05)', {}, { deprecated })
        .model('gemini-2.5-flash', 'Gemini 2.5 Flash', { thinking: 'optional', thinkingDisableStrategy: 'set_to_zero' }, { deprecated })
        .model('gemini-2.5-flash-preview-05-20', 'Gemini 2.5 Flash Preview (2025-05-20)', {}, { deprecated });

    // Gemini 2.0: 2026-06-01 종료
    builder.group('Gemini 2.0', genAPI, {})
        .model('gemini-2.0-flash', 'Gemini 2.0 Flash', {}, { deprecated })
        .model('gemini-2.0-flash-001', 'Gemini 2.0 Flash 001', {}, { snapshot, deprecated })
        .model('gemini-2.0-flash-exp', 'Gemini 2.0 Flash Exp', {}, { deprecated })
        .model('gemini-2.0-flash-lite', 'Gemini 2.0 Flash-Lite', {}, { deprecated })
        .model('gemini-2.0-flash-lite-001', 'Gemini 2.0 Flash-Lite 001', {}, { snapshot, deprecated });

    // Gemini 1.5: 서비스 종료됨
    builder.group('Gemini 1.5', genAPI, {})
        .model('gemini-1.5-pro-latest', 'Gemini 1.5 Pro (latest)', {}, { deprecated })
        .model('gemini-1.5-pro', 'Gemini 1.5 Pro (stable)', {}, { deprecated })
        .model('gemini-1.5-pro-002', 'Gemini 1.5 Pro 002', {}, { snapshot, deprecated })
        .model('gemini-1.5-pro-001', 'Gemini 1.5 Pro 001', {}, { snapshot, deprecated })
        .model('gemini-1.5-flash-latest', 'Gemini 1.5 Flash (latest)', {}, { deprecated })
        .model('gemini-1.5-flash', 'Gemini 1.5 Flash (stable)', {}, { deprecated })
        .model('gemini-1.5-flash-002', 'Gemini 1.5 Flash 002', {}, { snapshot, deprecated })
        .model('gemini-1.5-flash-001', 'Gemini 1.5 Flash 001', {}, { snapshot, deprecated })
        .model('gemini-1.5-flash-8b-latest', 'Gemini 1.5 Flash 8B (latest)', {}, { deprecated })
        .model('gemini-1.5-flash-8b', 'Gemini 1.5 Flash 8B (stable)', {}, { deprecated })
        .model('gemini-1.5-flash-8b-001', 'Gemini 1.5 Flash 8B 001', {}, { snapshot, deprecated });
}

export default initProvider;