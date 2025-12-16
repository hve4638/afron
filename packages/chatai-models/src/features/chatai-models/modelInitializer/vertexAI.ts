import { flags } from '@/data';
import { CategoryBuilder } from '@/features/model-builder';

const {
    latest,
    featured,
    deprecated,
    snapshot
} = flags;

// Vertex AI Models 목록
// https://console.cloud.google.com/vertex-ai/model-garden
function initProvider(builder: CategoryBuilder) {
    builder.group('Claude', { endpoint: 'vertexai_claude', thinking: 'optional' }, {})
        .model('claude-opus-4@20250514', 'claude-opus-4@20250514', {}, { latest, featured })
        .model('claude-sonnet-4@20250514', 'claude-sonnet-4@20250514', {}, { latest, featured })
        .model('claude-3-7-sonnet@20250219', 'claude-3-7-sonnet@20250219', {}, { latest, featured })
        .model('claude-3-5-sonnet-v2@20241022', 'claude-3-5-sonnet-v2@20241022', {}, { latest, featured })
        .model('claude-3-5-sonnet@20240620', 'claude-3-5-sonnet@20240620', {}, { snapshot, featured })
        .model('claude-3-5-haiku@20241022', 'claude-3-5-haiku@20241022', {}, { latest, featured })
        .model('claude-3-opus@20240229', 'claude-3-opus@20240229', {}, { snapshot })
        .model('claude-3-sonnet@20240229', 'claude-3-sonnet@20240229', {}, { snapshot })
        .model('claude-3-haiku@20240307', 'claude-3-haiku@20240307', {}, { snapshot });
    
    builder.group('Gemini 3', { endpoint: 'vertexai_gemini', supportGeminiSafetyFilter: true, thinkingDisableStrategy: 'set_to_zero' }, {})
        .model('gemini-3-pro-preview', 'gemini-3-pro-preview', { thinking: 'enabled' }, { latest, featured });
        
    builder.group('Gemini 2.5', { endpoint: 'vertexai_gemini', supportGeminiSafetyFilter: true, thinkingDisableStrategy: 'set_to_zero' }, {})
        .model('gemini-2.5-pro', 'gemini-2.5-pro', { thinking: 'enabled' }, { latest, featured })
        .model('gemini-2.5-pro-preview-06-05', 'gemini-2.5-pro-preview-06-05', { thinking: 'enabled' }, { snapshot })
        .model('gemini-2.5-pro-preview-05-06', 'gemini-2.5-pro-preview-05-06', { thinking: 'enabled' }, { snapshot })
        .model('gemini-2.5-pro-preview-03-25', 'gemini-2.5-pro-preview-03-25', { thinking: 'enabled' }, { snapshot })
        .model('gemini-2.5-flash', 'gemini-2.5-flash', { thinking: 'optional' }, { latest, featured })
        .model('gemini-2.5-flash-preview-05-20', 'gemini-2.5-flash-preview-05-20', { thinking: 'optional' }, { snapshot })
        .model('gemini-2.5-flash-preview-04-17', 'gemini-2.5-flash-preview-04-17', { thinking: 'optional' }, { snapshot })
        .model('gemini-2.5-flash-lite', 'gemini-2.5-flash-lite', { thinking: 'optional' }, { latest, featured })
        .model('gemini-2.5-flash-lite-preview-06-17', 'gemini-2.5-flash-lite-preview-06-17', { thinking: 'optional' }, { snapshot })
}

export default initProvider;