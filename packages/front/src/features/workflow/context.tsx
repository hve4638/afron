import { useContextForce } from '@/context';
import { createContext, SetStateAction, useCallback } from 'react';
import { ChangeRTFlowDataAction, RemoveRTFlowDataAction } from './types';
import { FlowEdge, FlowNode } from '@/lib/xyflow';
import { RTFlowData, RTFlowNodeData } from '@afron/types';

export interface WorkflowState {
    nodes: FlowNode[];
    edges: FlowEdge[];
    data: RTFlowData;
    onNodesChange: (changes: SetStateAction<FlowNode[]>) => void;
    onEdgesChange: (changes: SetStateAction<FlowEdge[]>) => void;
    onDataChange: (data: RTFlowData) => void;

    /** nodeId에서 NodeData 리턴 */
    getNodeData: (nodeId: string) => RTFlowNodeData;
    /** nodeId에 해당하는 NodeData 변경 */
    setNodeData: (nodeId: string, data: SetStateAction<RTFlowNodeData>) => void;
    /** nodeId에 해당하는 NodeData 제거 */
    removeNodeData: (nodeId: string) => void;
}

export const WorkflowContext = createContext<WorkflowState | null>(null);

interface WorkflowContextProps {
    nodes: FlowNode[];
    edges: FlowEdge[];
    data: RTFlowData;
    onNodesChange: (changes: SetStateAction<FlowNode[]>) => void;
    onEdgesChange: (changes: SetStateAction<FlowEdge[]>) => void;
    onDataChange: (data: SetStateAction<RTFlowData>) => void;

    children?: React.ReactNode;
}

export function WorkflowContextProvider({
    children,

    nodes,
    edges,
    data,
    onNodesChange,
    onEdgesChange,
    onDataChange,
}: WorkflowContextProps) {
    const getNodeData: (nodeId: string) => RTFlowNodeData = useCallback((nodeId: string) => {
        // 존재하지 않는 nodeId일 경우 기본값 반환
        // 노드 제거 등의 상황에서 잠시 참조 할 수 없는 경우 에러를 방지하기 위함
        const nodeData = data[nodeId] ?? {
            type: 'unknown',
            description: '',
            position: { x: 0, y: 0 },
            data: {},
            connection: [],
        };

        nodeData.data ??= {};

        return nodeData;
    }, [data]);

    const setNodeData = useCallback((nodeId: string, data: SetStateAction<RTFlowNodeData>) => {
        onDataChange((prev) => {
            if (typeof data === 'function') {
                data = data(prev[nodeId] ?? {});
            }
            console.log('setNodeData', nodeId, data);

            return {
                ...prev,
                [nodeId]: data,
            };
        });
    }, [onDataChange]);
    const removeNodeData = useCallback((nodeId: string) => {
        onDataChange((prev) => {
            const newData = { ...prev };
            delete newData[nodeId];
            return newData;
        });
    }, [onDataChange]);

    return (
        <WorkflowContext.Provider
            value={{
                nodes,
                edges,
                data,
                getNodeData,
                onNodesChange,
                onEdgesChange,
                
                onDataChange,
                setNodeData,
                removeNodeData,
            }}
        >
            {children}
        </WorkflowContext.Provider>
    );
}

export function useWorkflowContext() {
    return useContextForce(WorkflowContext);
}