import { useCallback } from 'react';
import { FlowNode } from '@/lib/xyflow';
import { useWorkflowContext } from '../context';
import { UseWorkflowHandlersProps } from '../types';

export function useWorkflowDelete({
    transaction,

    nodes,
    edges,
}: UseWorkflowHandlersProps) {
    const {
        data,
        removeNodeData,
    } = useWorkflowContext();

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

    return {
        onBeforeDelete,
    }
}
