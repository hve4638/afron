import { JSONType } from 'ac-storage'
import { SAFETY_SETTING_THRESHOLD } from './gemini-safety'

export const MODEL_SETTINGS = {
    'stream': JSONType.Bool().nullable().default_value(false),

    'temperature': JSONType.Number().nullable().default_value(1),
    'max_tokens': JSONType.Number().nullable().default_value(1024),
    'top_p': JSONType.Number().nullable().default_value(1.0),

    'use_thinking': JSONType.Bool().nullable().default_value(false),
    'thinking_auto_budget': JSONType.Bool().nullable().default_value(false),
    'thinking_tokens': JSONType.Number().nullable().default_value(1024),
    'thinking_effort': JSONType.Union('minimal', 'low', 'medium', 'high').nullable().default_value('medium'),
    'verbosity': JSONType.Union('low', 'medium', 'high').nullable().default_value('medium'),

    'safety_settings': {
        'HARM_CATEGORY_HARASSMENT': SAFETY_SETTING_THRESHOLD,
        'HARM_CATEGORY_HATE_SPEECH': SAFETY_SETTING_THRESHOLD,
        'HARM_CATEGORY_SEXUALLY_EXPLICIT': SAFETY_SETTING_THRESHOLD,
        'HARM_CATEGORY_DANGEROUS_CONTENT': SAFETY_SETTING_THRESHOLD,
        'HARM_CATEGORY_CIVIC_INTEGRITY': SAFETY_SETTING_THRESHOLD,
    }
}

export const GLOBAL_MODEL_SETTINGS = {
    'override_enabled': JSONType.Bool().nullable().default_value(false),

    'override_common': JSONType.Bool().nullable().default_value(false),
    'override_thinking': JSONType.Bool().nullable().default_value(false),
    'override_safety_settings': JSONType.Bool().nullable().default_value(false),
    'override_gpt5': JSONType.Bool().nullable().default_value(false),

    ...MODEL_SETTINGS,
}