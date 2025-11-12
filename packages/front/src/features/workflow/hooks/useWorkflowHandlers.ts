import { useWorkflowNodesChanges } from './useWorkflowNodeChanges';
import { useWorkflowEdgesChanges } from './useWorkflowEdgeChanges';
import { useWorkflowDragDrop } from './useWorkflowDragDrop';
import { useWorkflowConnection } from './useWorkflowConnection';
import { useWorkflowDelete } from './useWorkflowDelete';

import { UseWorkflowHandlersProps } from '../types';

export function useWorkflowHandlers(props: UseWorkflowHandlersProps) {
    const { onConnect, isValidConnection } = useWorkflowConnection(props);
    const { onDragOver, onDrop } = useWorkflowDragDrop(props);
    const { handleNodesChange } = useWorkflowNodesChanges(props);
    const { handleEdgesChange } = useWorkflowEdgesChanges(props);
    const { onBeforeDelete } = useWorkflowDelete(props);

    return {
        onConnect,
        isValidConnection,
        onNodesChange: handleNodesChange,
        onEdgesChange: handleEdgesChange,
        onDragOver,
        onDrop,
        onBeforeDelete,
    }
}