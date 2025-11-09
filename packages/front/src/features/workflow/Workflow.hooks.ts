import { useEffect, useLayoutEffect, useState } from 'react';
import {
    useNodesState,
    useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FlowNode } from '@/lib/xyflow';

import useHotkey from '@/hooks/useHotkey';
import { useWorkflowTransaction, useWorkflowHandlers } from './hooks';
import { useWorkflowContext } from './context';

export function useWorkflow() {
    const {
        nodes: initialNodes,
        edges: initialEdges,

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
    
    const [lastSelectedNode, setLastSelectedNode] = useState<FlowNode | null>(null);
    useLayoutEffect(() => {
        const selectedNode = nodes.find(n => n.selected);

        if (selectedNode?.id !== lastSelectedNode?.id) {
            setLastSelectedNode(selectedNode ?? null);
        }
    }, [nodes]);    

    useHotkey({
        'z': (event) => {
            if (!event.ctrlKey) {
                // do nothing
            }
            else if (event.shiftKey) {
                event.preventDefault();

                if (transaction.canRedo) {
                    transaction.redo();
                }
            }
            else {
                event.preventDefault();

                if (transaction.canUndo) {
                    transaction.undo();
                }
            }
            return false;
        },

        'y': (event) => {
            if (event.ctrlKey && !event.shiftKey) {
                event.preventDefault();

                if (transaction.canRedo) {
                    transaction.redo();
                }
            }
            return false;
        }
    }, true, [transaction]);

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