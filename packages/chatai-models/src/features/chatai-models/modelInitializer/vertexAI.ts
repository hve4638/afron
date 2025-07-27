import { flags } from '@/data';
import { CategoryBuilder } from '@/features/model-builder';

const {
    latest,
    featured,
    deprecated,
    snapshot
} = flags;

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
    
    builder.group('Gemini', { endpoint: 'vertexai_gemini' }, {})
        .model('gemini-2.5-pro-preview-05-06', 'gemini-2.5-pro-preview-05-06', { thinking: 'enabled' }, { latest, featured })
        .model('gemini-2.5-pro-preview-03-25', 'gemini-2.5-pro-preview-03-25', { thinking: 'enabled' }, { latest })
        .model('gemini-2.5-flash-preview-05-20', 'gemini-2.5-flash-preview-05-20', { thinking: 'optional' }, { latest, featured })
        .model('gemini-2.5-flash-preview-04-17', 'gemini-2.5-flash-preview-04-17', { thinking: 'optional' }, { latest });
}

export default initProvider;