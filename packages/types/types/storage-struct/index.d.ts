import { GeminiSafetySetting, SupportedThinkingEfforts, SupportedVerbosity } from '../chatai';
import { FlowNodeType, RTForm } from '../rt';

export declare namespace ProfileStorage {
    namespace RT {
        type Index = {
            version: string;
            id: string;
            name: string;
            uuid: string;
            mode: 'flow' | 'prompt_only';
            input_type: 'normal' | 'chat';
            forms: string[];
            entrypoint_node: number;
            prompts: PromptOrder;
        }
        
        // form.json 내 { [string]: Form } 형식의 Form에 해당
        type Form = RTForm;
        // {
        //     type: 'text' | 'number' | 'checkbox' | 'select' | 'array' | 'struct';
        //     id: string;
        //     display_name: string;
        //     display_on_header: boolean;

        //     config: {
        //         text?: FormConfig.Text,
        //         number?: FormConfig.Number,
        //         checkbox?: FormConfig.Checkbox,
        //         select?: FormConfig.Select,
        //         array?: FormConfig.Array,
        //         struct?: FormConfig.Struct,
        //     }
        // }
        
        // request-template.<rt-id>.prompt.<prompt-id>
        type Prompt = {
            id: string;
            name: string
            variables: Array<{
                name: string;
                form_id: string;
                weak: boolean;
            }>;
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

        type FlowNode = {
            type: FlowNodeType;
            description: string;
            data: Record<string, any>;
            connection: Array<{
                from_handle: string;
                to_node: string;
                to_handle: string;
            }>;
            position: {
                x: number;
                y: number;
            };
        }

        type PromptOrder = {
            id: string;
            name: string;
        }[];
    }
}

export type ModelConfiguration = {
    stream?: boolean;

    temperature?: number;
    top_p?: number;
    max_tokens?: number;

    use_thinking?: boolean;
    thinking_auto_budget?: boolean;
    thinking_tokens?: number;
    thinking_effort?: SupportedThinkingEfforts;
    thinking_summary?: boolean;
    verbosity?: SupportedVerbosity;

    safety_settings?: Partial<Record<GeminiSafetySetting.FilterNames, GeminiSafetySetting.Threshold>>;
}

export type GlobalModelConfiguration = {
    /**
     * 전역 설정에서 기존 설정을 덮어쓰는지 여부
     * 
     * 전역 설정이 아니라면 무시됨
     */
    override_enabled?: boolean;

    override_common?: boolean;
    override_thinking?: boolean;
    override_safety_settings?: boolean;
    override_gpt5?: boolean;
} & ModelConfiguration;


export { };