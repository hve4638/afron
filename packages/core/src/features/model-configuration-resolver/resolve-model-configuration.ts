export function resolveModelConfiguration(
    globalConfigs: GlobalModelConfiguration[] = [],
    configs: ModelConfiguration[] = [],
): Required<ModelConfiguration> {
    const result: Required<ModelConfiguration> = {
        stream: false,

        top_p: 1.0,
        temperature: 1.0,
        max_tokens: 4096,

        use_thinking: false,
        thinking_auto_budget: false,
        thinking_tokens: 1000,
        thinking_summary: false,

        safety_settings: {
            HARM_CATEGORY_CIVIC_INTEGRITY: 'OFF',
            HARM_CATEGORY_HATE_SPEECH: 'OFF',
            HARM_CATEGORY_HARASSMENT: 'OFF',
            HARM_CATEGORY_DANGEROUS_CONTENT: 'OFF',
            HARM_CATEGORY_SEXUALLY_EXPLICIT: 'OFF',
        },
    }

    for (const config of configs) {
        const nextSS = {
            ...result.safety_settings,
            ...config.safety_settings,
        };

        Object.assign(result, config);
        result.safety_settings = nextSS;
    }

    for (const config of globalConfigs) {
        if (!config.override_enabled) continue;
        if (config.override_common) {
            result.stream = config.stream ?? result.stream;
            result.top_p = config.top_p ?? result.top_p;
            result.temperature = config.temperature ?? result.temperature;
            result.max_tokens = config.max_tokens ?? result.max_tokens;
        }
        if (config.override_thinking) {
            result.use_thinking = config.use_thinking ?? result.use_thinking;
            result.thinking_auto_budget = config.thinking_auto_budget ?? result.thinking_auto_budget;
            result.thinking_tokens = config.thinking_tokens ?? result.thinking_tokens;
            result.thinking_summary = config.thinking_summary ?? result.thinking_summary;
        }
        if (config.override_safety_settings) {
            result.safety_settings = {
                ...result.safety_settings,
                ...config.safety_settings,
            };
        }
    }

    return result;
}

