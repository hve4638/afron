import { useCallback, useState } from 'react';
import { NodeChange } from '@xyflow/react';
import { FlowNode } from '@/lib/xyflow';
import { UseWorkflowHandlersProps } from '../types';

export function useWorkflowNodesChanges({
    transaction,

    nodes,
    setNodes,
    onNodesChange,
}: UseWorkflowHandlersProps) {
    const [dragTrack] = useState(() => new Map<string, { x: number; y: number }>());

    const handleNodeChange = useCallback((changed: NodeChange<FlowNode>) => {
        // Undo / Redo 실행 중에는 기록하지 않음
        if (transaction.isProgrammatic) return;

        switch (changed.type) {
            case 'remove':
                // onBeforeDelete에서 처리하므로 여기서는 스킵
                break;

            case 'position':
                // 드래그 시작 시 초기 위치 저장
                if (changed.dragging && !dragTrack.has(changed.id)) {
                    const node = nodes.find(n => n.id === changed.id);
                    if (node?.position) {
                        dragTrack.set(changed.id, node.position);
                    }
                }

                // 드래그 종료 시 트랜잭션 기록
                if (changed.dragging === false && changed.position) {
                    const fromPosition = dragTrack.get(changed.id);
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
                        dragTrack.delete(changed.id);
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
    ]);

    const handleNodesChange = useCallback((changes: NodeChange<FlowNode>[]) => {
        for (const change of changes) {
            handleNodeChange(change);
        }

        onNodesChange(changes);
    }, [onNodesChange, handleNodeChange]);

    return {
        handleNodesChange,
    }
}