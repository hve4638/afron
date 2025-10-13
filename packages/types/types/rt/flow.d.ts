
export type FlowNodeType = (
    'rt-input'
    | 'rt-start'
    | 'rt-end'
    | 'rt-output'
    | 'prompt-template'
    | 'llm-fetch'
);

export type RTFlowData = Record<string, RTFlowNodeData>;
export type RTFlowNodeData = {
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

export { };