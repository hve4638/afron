import { SetStateAction } from 'react';
import { RTFlowNodeData } from '@afron/types';

export interface OptionProps<T = Record<string, any>> {
    nodeData: RTFlowNodeData;
    setNodeData: (data: SetStateAction<RTFlowNodeData>) => void;
    removeNodeData: () => void;

    option: T;
    setOption: (option: SetStateAction<T>) => void;
}