import { FlowNode } from "@/lib/xyflow";

export const HandleTypes = {
    LLMResult: 'LLMResult',

    Input: 'Input',
    Output: 'Output',

    ChatMessages: 'ChatMessages',
} as const;
export type HandleTypes = typeof HandleTypes[keyof typeof HandleTypes];

export type HandleColor = {
    value: string;
    selected: string;
}
export const HandleColors: Record<HandleTypes, HandleColor> = {
    [HandleTypes.LLMResult]: {
        value: '#f59e0bba',
        selected: '#f59e0b',
        // value: '#10b981ba',
        // selected: '#10b981',
    },
    [HandleTypes.Input]: {
        value: '#3b82f6ba',
        selected: '#3b82f6',
    },
    [HandleTypes.Output]: {
        value: '#f59e0bba',
        selected: '#f59e0b',
    },
    [HandleTypes.ChatMessages]: {
        value: '#8b5cf6ba',
        selected: '#8b5cf6',
    },
};

export type EdgeInfo = readonly [
    string,
    typeof HandleTypes[keyof typeof HandleTypes],
];
export interface WorkflowNodeData<TNodeId extends string = string> {
    type: TNodeId;
    alias: string[];
    
    inputs: string[];
    inputTypes: Record<string, string>;
    outputs: string[];
    outputTypes: Record<string, string>;
}