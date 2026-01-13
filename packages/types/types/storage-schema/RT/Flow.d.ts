import { FlowNodeType } from '../../rt';

export type Flow = {
    FlowNode: FlowNode;
}

export type FlowNode = {
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