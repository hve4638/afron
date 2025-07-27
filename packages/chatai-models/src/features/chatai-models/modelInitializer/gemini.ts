import { CategoryBuilder } from '@/features/model-builder';
import { flags } from '@/data';

const {
    latest,
    featured,
    deprecated,
    snapshot,
} = flags;

function initProvider(builder: CategoryBuilder) {
    const genAPI:ChatAIConfig = { endpoint: 'generative_language' };

    builder.group('Gemini 2.5', genAPI, {})
        .model('gemini-2.5-pro', 'Gemini 2.5 Pro', { thinking: 'enabled' }, { latest, featured })
        .model('gemini-2.5-pro-preview-06-05', 'Gemini 2.5 Pro Preview (06-05)', {}, { deprecated })
        .model('gemini-2.5-flash', 'Gemini 2.5 Flash', { thinking: 'optional' }, { latest, featured })
        .model('gemini-2.5-flash-preview-05-20', 'Gemini 2.5 Flash Preview (05-20)', {}, { deprecated});
    
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