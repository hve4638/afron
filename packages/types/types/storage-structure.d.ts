import './chatai';

declare global {
    type ModelConfiguration = {
        stream?: boolean;

        temperature?: number;
        top_p?: number;
        max_tokens?: number;

        use_thinking?: boolean;
        thinking_auto_budget?: boolean;
        thinking_tokens?: number;
        thinking_effort?: SupportedThinkingEfforts;
        thinking_summary?: boolean;

        safety_settings?: Partial<Record<GeminiSafetySetting.FilterNames, GeminiSafetySetting.Threshold>>;
    }

    type GlobalModelConfiguration = {
        /**
         * 전역 설정에서 기존 설정을 덮어쓰는지 여부
         * 
         * 전역 설정이 아니라면 무시됨
         */
        override_enabled?: boolean;

        override_common?: boolean;
        override_thinking?: boolean;
        override_safety_settings?: boolean;
    } & ModelConfiguration;
}

export { };