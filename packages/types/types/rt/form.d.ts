declare global {
    type RTIndex = {
        version : string;
        id : string;
        name : string;
        uuid : string;
        mode : 'flow' | 'prompt_only';
        input_type : 'normal' | 'chat';
        form : string[];
        entrypoint_node : number;
    }

    type RTPromptData = {
        id : string;
        name : string;
        variables : string[];

        model: {
            stream: boolean;
            
            top_p: number;
            temperature: number;
            max_tokens: number;
            use_thinking: boolean;
            thinking_tokens: number;
            thinking_auto_budget: boolean;
            thinking_tokens: number;
            // thinking_summary: boolean;

            safety_settings: Record<GeminiSafetySetting.FilterNames, GeminiSafetySetting.Threshold>;
        };
    }

    type RTPromptDataEditable = {
        name? : string;
        model?: {
            temperature?: number;
            top_p?: number;
            max_tokens?: number;
            use_thinking?: boolean;
            thinking_tokens?: number;
        };
        contents?: string;
    }

    type RTForm = {
        type : 'text' | 'number' | 'checkbox' | 'select' | 'array' | 'struct' ;
        id : string;
        display_name : string;
        display_on_header : boolean;
    
        config : {
            text? : RTFormText;
            number? : RTFormNumber;
            checkbox? : RTFormCheckbox;
            select? : RTFormSelect;
            array? : RTFormArray;
            struct? : RTFormStruct;
        }
    }
    
    type RTFormText = { 
        default_value : string;
        placeholder : string;
        allow_multiline : boolean;
    }
    type RTFormNumber = {
        default_value : number;
        minimum_value? : number;
        maximum_value? : number;
        allow_decimal : boolean;
    }
    type RTFormCheckbox = {
        default_value : boolean;
    }
    type RTFormSelect = {
        default_value : string;
        options : {
            name : string;
            value : string;
        }[];
    }
    type RTFormStruct = {
        fields : RTFormStructField[];
    }
    type RTFormStructField = {
        type : 'text' | 'number' | 'checkbox' | 'select';
        name : string;
        display_name : string;

        config : {
            text? : RTFormText;
            number? : RTFormNumber;
            checkbox? : RTFormCheckbox;
            select? : RTFormSelect;
        }
    }
    type RTFormArray = {
        minimum_length? : number;
        maximum_length? : number;
        element_type : 'text' | 'number' | 'checkbox' | 'select' | 'struct';
        config : {
            text? : RTFormText;
            number? : RTFormNumber;
            checkbox? : RTFormCheckbox;
            select? : RTFormSelect;
            struct? : RTFormStruct;
        }
    }
}

export {}