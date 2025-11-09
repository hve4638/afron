import { SetStateAction, useCallback, useMemo } from 'react';
import FocusLock from 'react-focus-lock';
import { FlowNode } from '@/lib/xyflow';
import { RTFlowNodeData, RTFlowNodeOptions } from '@afron/types';

import { Align, Column, Flex, Gap, Row } from '@/components/layout';
import { GIconButton } from '@/components/GoogleFontIcon';
import { Textarea } from '@/components/ui/Textarea';

import {
    PromptTemplateOption,
    LLMOption,
    StartOption,
} from './options';
import { useWorkflowContext } from '../../context';

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
        removeNodeData,
    } = useWorkflowContext();
    const nodeData = useMemo(() => getNodeData(node.id), [data, node]);

    const setSpecificNodeData = useCallback((data: SetStateAction<RTFlowNodeData>) => {
        setNodeData(node.id, data);
    }, [setNodeData, node]);
    const removeSpecificNodeData = useCallback(() => {
        removeNodeData(node.id);
    }, [removeNodeData, node]);

    const option = useMemo(() => nodeData.data ?? {}, [nodeData]);
    const setOption = useCallback((next: SetStateAction<Record<string, any>>) => {
        if (typeof next === 'function') {
            next = next(nodeData.data) as Record<string, any>;
        }

        setNodeData(node.id, (prev) => ({
            ...prev,
            data: next,
        }));
    }, [nodeData, setNodeData]);
    const getOptionDispatcher = useCallback(<TOption extends Record<string, any>>() => {
        
    }, [nodeData]);

    const title = (node.data['label'] ?? 'Unknown') as string;
    const optionComponent = useMemo(() => {
        const props = {
            nodeData,
            setNodeData: setSpecificNodeData,
            removeNodeData: removeSpecificNodeData,

            option,
            setOption,
        }

        if (node.type === 'llm-fetch') {
            return <LLMOption
                {...props}
                option={nodeData.data as unknown as RTFlowNodeOptions.LLM}
            />;
        }
        else if (node.type === 'prompt-template') {
            return <PromptTemplateOption {...props as any} />;
        }
        else if (node.type === 'rt-start') {
            return <StartOption {...props as any} />;
        }

        return null;
    }, [nodeData, node]);

    return {
        state: {
            title,
            description: nodeData.description,
        },

        setSpecificNodeData,
        optionComponent,
    }
}