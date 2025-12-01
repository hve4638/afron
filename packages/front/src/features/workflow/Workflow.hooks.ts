import { useEffect, useLayoutEffect, useState } from 'react';
import {
    useNodesState,
    useEdgesState,
} from '@xyflow/react';
import { FlowNode } from '@/lib/xyflow';

import { useWorkflowTransaction, useWorkflowHandlers } from './hooks';
import { useWorkflowContext } from './context';
import { useKeyBind } from '@/hooks/useKeyBind';

export function useWorkflow() {
    const {
        initialStates: {
            nodes: initialNodes,
            edges: initialEdges,
        },

        onNodesChange: onExternalNodesChange,
        onEdgesChange: onExternalEdgesChange,
    } = useWorkflowContext();
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    useEffect(() => onExternalNodesChange(nodes), [nodes]);
    useEffect(() => onExternalEdgesChange(edges), [edges]);

    const transaction = useWorkflowTransaction({
        setNodes,
        setEdges,
    });

    const handlers = useWorkflowHandlers({
        transaction,
        nodes,
        setNodes,
        onNodesChange,
        edges,
        setEdges,
        onEdgesChange,
    });

    const tryUndo = () => { transaction.canUndo && transaction.undo(); }
    const tryRedo = () => { transaction.canRedo && transaction.redo(); }

    useKeyBind({
        'C-z': tryUndo,
        'C-S-z': tryRedo,
        'C-y': tryRedo,
    }, [transaction]);

    const [lastSelectedNode, setLastSelectedNode] = useState<FlowNode | null>(null);
    useLayoutEffect(() => {
        const selectedNode = nodes.find(n => n.selected);

        if (selectedNode?.id !== lastSelectedNode?.id) {
            setLastSelectedNode(selectedNode ?? null);
        }
    }, [nodes]);

    return {
        nodes,
        edges,

        lastSelectedNode,
        setLastSelectedNode,

        // Transaction 상태 및 액션
        transaction: {
            canUndo: transaction.canUndo,
            canRedo: transaction.canRedo,
            undo: transaction.undo,
            redo: transaction.redo,
            clearHistory: transaction.clearHistory,
        },

        callback: handlers,
    }
}