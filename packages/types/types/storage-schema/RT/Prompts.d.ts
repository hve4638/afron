import { GeminiSafetySetting } from '../../chatai';

export type Prompts = {
    id: string;
    name: string
    variables: PromptVar[];
    constants: Array<{
        name: string;
        value: any;
    }>;
    model: {
        stream: boolean;

        top_p: number;
        temperature: number;
        max_tokens: number;
        use_thinking: boolean;
        thinking_tokens: number;
        thinking_auto_budget: boolean;
        thinking_effort: 'minimal' | 'low' | 'medium' | 'high';
        verbosity: 'low' | 'medium' | 'high';

        safety_settings: Record<GeminiSafetySetting.FilterNames, GeminiSafetySetting.Threshold>;
    };
    contents: string;
}

type PromptVar = {
    /** 변수 유형, external/form 선택 시 외부 연결이 끊기면 unknown으로 지정됨 */
    type: 'constant' | 'form' | 'external' | 'unknown';
    id: string;
    name: string;
    weak?: boolean;

    /** 'form'이면서 form_id가 없다면 id를 form_id로 대체 사용 (이전버전 호환성) */
    form_id?: string;
    external_id?: string;
    value?: any;
}