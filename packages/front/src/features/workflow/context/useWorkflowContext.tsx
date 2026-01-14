import { useContextForce } from '@/context';
import { WorkflowContext } from './WorkflowContext';

export function useWorkflowContext() {
    return useContextForce(WorkflowContext);
}