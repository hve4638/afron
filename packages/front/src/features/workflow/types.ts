import { WorkflowNodeTypes } from './nodes';

type WorkflowNodeTypeName = keyof typeof WorkflowNodeTypes;

export interface A {
    id: string;
    position: {
        x: number;
        y: number;
    };
    type: WorkflowNodeTypeName;
    data: any;
}