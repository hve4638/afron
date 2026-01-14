import { WorkflowNodeNames, WorkflowNodes } from '../../../nodes';

export type NodeSearchIndex = Array<{
    keyword: string;
    value: WorkflowNodeNames;
    category: string;
}>;

export type NodeSearchLookup = Record<string, NodeCategoryData>;

export type NodeCategoryData = {
    value: WorkflowNodeNames;
    category: string;
}

export interface NodeCategory {
    categoryName: string;
    nodes: Array<WorkflowNodeNames>;
}