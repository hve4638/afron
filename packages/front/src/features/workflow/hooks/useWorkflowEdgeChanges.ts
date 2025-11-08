import { useCallback } from 'react';
import { EdgeChange, } from '@xyflow/react';
import { UseWorkflowHandlersProps } from '../types';

export function useWorkflowEdgesChanges({
    transaction,
    onEdgesChange,
}: UseWorkflowHandlersProps) {
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

    return {
        handleEdgesChange,
    }
}