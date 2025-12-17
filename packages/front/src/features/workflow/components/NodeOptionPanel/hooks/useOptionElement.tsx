import { SetStateAction, useCallback, useMemo } from 'react';
import { NodeOptionProps, WorkflowNodes } from '../../nodes';
import { useWorkflowContext } from '@/features/workflow/context';
import { FlowNode } from '@/lib/xyflow';
import { RTFlowNodeData } from '@afron/types';

interface UseOptionComponentProps {
    node: FlowNode;
}

export function useOptionElement({
    node
}: UseOptionComponentProps) {
    const {
        data,
        getNodeData,
        setNodeData,
        removeNodeData,
    } = useWorkflowContext();
    const nodeData = useMemo(() => getNodeData(node.id), [data, node]);
    const option = useMemo(() => nodeData.data ?? {}, [nodeData]);
    const setOption = useCallback((next: SetStateAction<Record<string, any>>) => {
        if (typeof next === 'function') {
            next = next(nodeData.data) as Record<string, any>;
        }
        
        setNodeData(node.id, (prev) => ({
            ...prev,
            data: next,
        }));
    }, [nodeData, setNodeData])
    const setSpecificNodeData = useCallback((data: SetStateAction<RTFlowNodeData>) => {
        setNodeData(node.id, data);
    }, [setNodeData, node]);
    const removeSpecificNodeData = useCallback(() => {
        removeNodeData(node.id);
    }, [removeNodeData, node]);

    // 노드 타입에 따른 옵션 컴포넌트 렌더링
    const optionElement = useMemo(() => {
        const props: NodeOptionProps = {
            nodeData,
            setNodeData: setSpecificNodeData,
            removeNodeData: removeSpecificNodeData,

            option,
            setOption,
        }

        if (!node.type) return null;

        // @TODO: 현재 any 타입으로 처리됨
        // 추후 타입 안정성 강화 필요
        const NodeComponent = WorkflowNodes[node.type];
        if (!NodeComponent) return null;

        const OptionComponent = NodeComponent.Option;

        return <OptionComponent {...props} />;
    }, [node, nodeData]);

    return optionElement;
}