declare global {
    type FlowNodeType = (
        'rt-input'
        | 'rt-output'
        | 'prompt-template'
        | 'llm-fetch'
    );

    type RTFlowData = Record<string, RTFlowNodeData>;
    type RTFlowNodeData = {
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
}

export { };