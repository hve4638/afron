type SetStateAction<S> = S | ((prevState: S) => S);

export type ChangeRTFlowDataAction = (nodeId: string, data: SetStateAction<RTFlowNodeData>) => void;
export type RemoveRTFlowDataAction = (nodeId: string) => void;