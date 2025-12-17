import { FlowEdge, FlowNode } from '@/lib/xyflow';
import { useProfileAPIStore } from '@/stores';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { convertFlowDataToWorkflow, applyWorkflowData } from './utils';
import { RTFlowData } from '@afron/types';
import { useRTStore } from '@/context/RTContext';
import { emitNavigate } from '@/events/navigate';

export function useWorkflowEditor() {
    const { api } = useProfileAPIStore();
    const { rtId } = useParams();
    const [flowNode, setFlowNode] = useState<FlowNode[] | null>(null);
    const [flowEdges, setFlowEdges] = useState<FlowEdge[] | null>(null);
    const [flowData, setFlowData] = useState<RTFlowData>({});

    const rt = useRTStore();

    useEffect(() => {
        if (!rtId) return;

        (async () => {
            const flowData = await rt.get.workflowNodes();
            const { nodes, edges } = convertFlowDataToWorkflow(flowData);
            
            setFlowNode(nodes);
            setFlowEdges(edges);
            setFlowData(flowData);
        })();
    }, []);
    
    const save = async () => {
        if (!rtId) return;

        const appliedFlowData = applyWorkflowData(flowData, flowNode ?? [], flowEdges ?? []);
        await api.workflow.setFlowData(rtId, appliedFlowData);
        await rt.update.workflowNodes(appliedFlowData);
    }
    
    const closeModal = async () => {
        await save();

        emitNavigate('back');
    }

    return {
        workflow: {
            nodes: flowNode,
            edges: flowEdges,
            flowData,
            setFlowNode: setFlowNode as Dispatch<SetStateAction<FlowNode[]>>,
            setFlowEdges: setFlowEdges as Dispatch<SetStateAction<FlowEdge[]>>,
            setFlowData: setFlowData as Dispatch<SetStateAction<RTFlowData>>,
        },

        save,
        closeModal,
    };
}