import { WorkflowNodeTypeNames, WorkflowNodeTypes } from '../../../nodes';

export type NodeSearchIndex = Array<{
    keyword: string;
    value: WorkflowNodeTypeNames;
    category: string;
}>;

export type NodeSearchLookup = Record<string, NodeCategoryData>;

export type NodeCategoryData = {
    value: WorkflowNodeTypeNames;
    category: string;
}

export interface NodeCategory {
    categoryName: string;
    nodes: Array<WorkflowNodeTypeNames>;
}