import { useContextForce } from '@/context';
import { createContext } from 'react';

export interface WorkflowState {
    data: RTFlowData
}

export const WorkflowContext = createContext<WorkflowState | null>(null);

export function WorkflowContextProvider({
    children,
    data,
}: {
    children: React.ReactNode;
    data: RTFlowData;
}) {
    return (
        <WorkflowContext.Provider
            value={{ data }}
        >
            {children}
        </WorkflowContext.Provider>
    );
}

export function useWorkflowContext() {
    return useContextForce(WorkflowContext);
}