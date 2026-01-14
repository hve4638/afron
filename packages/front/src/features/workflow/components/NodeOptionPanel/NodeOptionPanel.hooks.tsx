import { SetStateAction, useCallback, useMemo } from 'react';
import { FlowNode } from '@/lib/xyflow';
import { RTFlowNodeData } from '@afron/types';
import { useWorkflowContext } from '../../context';
import { useOptionElement } from './hooks';

interface NodeOptionPanelProps {
    node: FlowNode;
    onClose?: () => void;
}

export function useNodeOptionPanel({
    node,
    onClose,
}: NodeOptionPanelProps) {
    const {
        data,
        getNodeData,
        setNodeData,
    } = useWorkflowContext();
    const nodeData = useMemo(() => getNodeData(node.id), [data, node]);

    const setSpecificNodeData = useCallback((data: SetStateAction<RTFlowNodeData>) => {
        setNodeData(node.id, data);
    }, [setNodeData, node]);

    const optionElement = useOptionElement({ node });

    const title = (node.data['label'] ?? 'Unknown') as string;

    return {
        state: {
            title,
            description: nodeData.description,
        },

        setSpecificNodeData,
        optionElement,
    }
}