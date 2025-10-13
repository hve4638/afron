import { FlowEdge, FlowNode } from '@/lib/xyflow';
import { useProfileAPIStore } from '@/stores';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { convertFlowDataToWorkflow, applyConnnectionsToFlowData, applyWorkflowData } from './utils';
import { RTFlowData } from '@afron/types';

export function useWorkflowEditor() {
    const navigate = useNavigate();
    const { api } = useProfileAPIStore();
    const { rtId } = useParams();
    const [flowNode, setFlowNode] = useState<FlowNode[] | null>(null);
    const [flowEdges, setFlowEdges] = useState<FlowEdge[] | null>(null);
    const [flowData, setFlowData] = useState<RTFlowData>({});
    const [isChanged, setIsChanged] = useState<boolean>(false);

    useEffect(() => {
        if (!rtId) return;

        (async () => {
            const flowData = await api.workflow.getFlowData(rtId);
            const { nodes, edges } = convertFlowDataToWorkflow(flowData);

            setFlowNode(nodes);
            setFlowEdges(edges);
            setFlowData(flowData);
            setIsChanged(false);
        })();
    }, []);

    /// @TODO: isChanged 체크 여부 개선 필요
    // 현재는 Workflow 로드 시 최초 1회 반드시 setter 호출되므로
    // isChanged가 항상 true

    const save = async () => {
        if (!rtId) return;

        const appliedFlowData = applyWorkflowData(flowData, flowNode ?? [], flowEdges ?? []);
        await api.workflow.setFlowData(rtId, appliedFlowData);
    }

    const close = async () => {
        await save();

        navigate('/');
    }

    const setFlowNodeWrap: Dispatch<SetStateAction<FlowNode[]>> = useCallback((next) => {
        setIsChanged(true);
        setFlowNode(next as SetStateAction<FlowNode[] | null>);
    }, [setFlowNode]);
    const setFlowEdgesWrap: Dispatch<SetStateAction<FlowEdge[]>> = useCallback((next) => {
        setIsChanged(true);
        setFlowEdges(next as SetStateAction<FlowEdge[] | null>);
    }, [setFlowEdges]);
    const setFlowDataWrap: Dispatch<SetStateAction<RTFlowData>> = useCallback((next) => {
        setIsChanged(true);
        setFlowData(next);
    }, [setFlowData]);

    return {
        workflow: {
            nodes: flowNode,
            edges: flowEdges,
            flowData,
            setFlowNode: setFlowNodeWrap,
            setFlowEdges: setFlowEdgesWrap,
            setFlowData: setFlowDataWrap,
        },

        save,
        close,
    };
}