import { Dispatch, RefObject, SetStateAction, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
    useNodesState,
    useEdgesState,
    addEdge,
    type OnConnect,
    type Connection,
    IsValidConnection,
    useReactFlow,
    NodeChange,
    EdgeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FlowEdge, FlowNode } from '@/lib/xyflow';

import { isHandleCompatible } from './nodes';
import { buildNode, findConnnectionLineColor, getNodeIdFromDropEvent } from './utils';
import { useWorkflowTransaction } from './WorkflowTransaction/WorkflowTransaction';
import { useWorkflowContext } from './context';
import useHotkey from '@/hooks/useHotkey';
import useTrigger from '@/hooks/useTrigger';

export function useWorkflow() {
    const {
        nodes: initialNodes,
        edges: initialEdges,
        data,

        setNodeData,
        removeNodeData,

        onNodesChange: onExternalNodesChange,
        onEdgesChange: onExternalEdgesChange,
    } = useWorkflowContext();
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    
    useEffect(() => onExternalNodesChange(nodes), [nodes]);
    useEffect(() => onExternalEdgesChange(edges), [edges]);

    const edgeColorized = useMemo(() => {
        return edges.map(edge => {
            const color = findConnnectionLineColor(nodes, edge);
            if (!color) return edge;

            return {
                ...edge,
                style: {
                    ...edge.style,
                    stroke: edge.selected ? color.selected : color.value,
                    strokeWidth: 2
                }
            };
        });
    }, [nodes, edges]);

    const [lastSelectedNode, setLastSelectedNode] = useState<FlowNode | null>(null);

    const reactFlowInstance = useReactFlow();

    // 트랜잭션 관리
    const transaction = useWorkflowTransaction({
        setNodes,
        setEdges,
    });

    // 드래그 시작 위치 추적 (position 변경 전 위치 저장)
    const nodePositionsRef = useRef<Map<string, { x: number; y: number }>>(new Map());

    const onConnect: OnConnect = useCallback(
        (connection) => {
            setEdges((prev) => {
                const next = addEdge(connection, prev);

                const addedEdge = next[next.length - 1];
                if (addedEdge && connection.source && connection.target) {
                    transaction.callbacks.onEdgeConnect(
                        addedEdge.id,
                        connection.source,
                        connection.target,
                        connection.sourceHandle ?? '',
                        connection.targetHandle ?? ''
                    );
                }
                return next;
            });
        },
        [setEdges, nodes, transaction],
    );

    // 연결 유효성 검사 콜백
    const isValidConnection = useCallback(
        (connection: Connection) => {
            const { sourceHandle, targetHandle } = connection;
            if (
                !sourceHandle
                || !targetHandle
                || connection.source === connection.target
            ) return false;

            const sourceNode = nodes.find((n) => n.id === connection.source);
            const targetNode = nodes.find((n) => n.id === connection.target);
            if (!sourceNode || !targetNode) return false;

            const sourceHandleType = sourceNode.data['outputTypes']![sourceHandle];
            const targetHandleType = targetNode.data['inputTypes']![targetHandle];

            if (!sourceHandleType || !targetHandleType) return false;

            return isHandleCompatible(sourceHandleType, targetHandleType);
        },
        [nodes],
    ) as IsValidConnection<FlowEdge>;

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback((event: React.DragEvent) => {
        event.preventDefault();

        const nodeId = getNodeIdFromDropEvent(event);
        if (!nodeId) return;

        const position = reactFlowInstance.screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });

        // @TODO: date 기반이 아니라 겹치지 않는 index 기반으로 변경
        const newNodeId = `${nodeId}-${Date.now()}`;
        const next = buildNode(newNodeId, position, nodeId);

        setNodeData(next.id, {
            connection: [],
            description: '',
            data: {},
            type: nodeId,
            position: next.position,
        });
        setNodes((prev) => prev.concat(next));

        transaction.callbacks.onNodeAdd(next);
    }, [reactFlowInstance, setNodes, transaction]);

    const handleNodeChange = useCallback((changed: NodeChange<FlowNode>) => {
        // Undo / Redo 실행 중에는 기록하지 않음
        if (transaction.isProgrammatic) return;

        switch (changed.type) {
            case 'remove':
                // onBeforeDelete에서 처리하므로 여기서는 스킵
                break;

            case 'position':
                // 드래그 시작 시 초기 위치 저장
                if (changed.dragging && !nodePositionsRef.current.has(changed.id)) {
                    const node = nodes.find(n => n.id === changed.id);
                    if (node?.position) {
                        nodePositionsRef.current.set(changed.id, node.position);
                    }
                }

                // 드래그 종료 시 트랜잭션 기록
                if (changed.dragging === false && changed.position) {
                    const fromPosition = nodePositionsRef.current.get(changed.id);
                    if (fromPosition) {
                        const hasMoved =
                            fromPosition.x !== changed.position.x ||
                            fromPosition.y !== changed.position.y;

                        if (hasMoved) {
                            transaction.callbacks.onNodeMove(
                                changed.id,
                                fromPosition,
                                changed.position
                            );
                        }
                        nodePositionsRef.current.delete(changed.id);
                    }
                }
                break;

            case 'add':
            case 'select':
            case 'dimensions':
            case 'replace':
                // 트랜잭션 기록 불필요
                break;
        }
    }, [
        nodes,
        transaction,
        setNodes,
        data,
        setNodeData,
    ]);

    const handleNodesChange = useCallback((changes: NodeChange<FlowNode>[]) => {
        for (const change of changes) {
            handleNodeChange(change);
        }

        onNodesChange(changes);
    }, [onNodesChange, handleNodeChange]);

    const handleEdgeChange = useCallback((changed: EdgeChange) => {
        if (transaction.isProgrammatic) return; // Undo/Redo 실행 중에는 기록하지 않음

        switch (changed.type) {
            case 'add':
            case 'remove':
            case 'replace':
                break;

            case 'select':
                break;
        }
    }, [transaction]);

    const handleEdgesChange = useCallback((changes: EdgeChange[]) => {
        for (const change of changes) {
            handleEdgeChange(change);
        }

        onEdgesChange(changes);
    }, [onEdgesChange, handleEdgeChange]);

    const onBeforeDelete = useCallback(async ({ nodes: nodesToDelete, edges: edgesToDelete }) => {
        if (transaction.isProgrammatic) { // Undo/Redo 실행 중 무시
            return { nodes: nodesToDelete, edges: edgesToDelete };
        }

        const nodeIdsToDelete = new Set(nodesToDelete.map((n: FlowNode) => n.id));
        for (const node of nodesToDelete) {
            const connectedEdges = edges.filter(
                e => e.source === node.id || e.target === node.id
            );

            // 노드 + 연결된 엣지를 단일 트랜잭션으로 기록
            transaction.callbacks.onNodeDelete(
                node,
                data[node.id] ?? {},
                connectedEdges
            );

            // 노드 데이터 제거
            removeNodeData(node.id);
        }

        for (const edge of edgesToDelete) {
            // 노드 삭제로 인한 edge 연결 해제 여부
            // cascaded 삭제인 경우 transaction 기록하지 않음
            const isCascaded = nodeIdsToDelete.has(edge.source) || nodeIdsToDelete.has(edge.target);

            if (!isCascaded) {
                transaction.callbacks.onEdgeDisconnect(
                    edge.id,
                    edge.source,
                    edge.target,
                    edge.sourceHandle ?? '',
                    edge.targetHandle ?? ''
                );
            }
        }

        return { nodes: nodesToDelete, edges: edgesToDelete };
    }, [edges, nodes, data, transaction, removeNodeData]);


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

    useLayoutEffect(() => {
        const selectedNode = nodes.find(n => n.selected);

        if (selectedNode?.id !== lastSelectedNode?.id) {
            setLastSelectedNode(selectedNode ?? null);
        }
    }, [nodes]);

    return {
        nodes,
        edges: edgeColorized,

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

        callback: {
            onNodesChange: handleNodesChange,
            onEdgesChange: handleEdgesChange,
            onConnect,
            isValidConnection,
            onDragOver,
            onDrop,
            onBeforeDelete,
        },
    }
}