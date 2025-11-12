import { HandleCompatibility } from './constants';
import { EdgeInfo, HandleColors, WorkflowNodeData } from './types';
import { HandleTypes } from './types';

/**
 * 연결하려는 두 Handle이 호환되는지 여부를 확인
 * @param from 
 * @param to 
 */
export function isHandleCompatible(from: HandleTypes, to: HandleTypes): boolean {
    if (from === to) return true;

    const compatible = HandleCompatibility[to];
    if (!compatible) return false;

    return compatible.includes(from);
}

interface buildNodeDataProps<TData extends object, TNodeId extends string> {
    type: TNodeId;
    name: string;
    alias: string[];
    inputs?: EdgeInfo[],
    outputs?: EdgeInfo[],
    defaultNodeData: TData;
}

/**
 * node-list/ 내부적으로 사용하는 WorkflowNodeData 빌드 헬퍼
 */
export function buildNodeData<TData extends object, TNodeId extends string>({
    type,
    name,
    alias = [],
    inputs = [],
    outputs = [],

    defaultNodeData,
}: buildNodeDataProps<TData, TNodeId>): WorkflowNodeData<TData, TNodeId> {
    const inputEdges = inputs.map(([name]) => name);
    const inputTypes = Object.fromEntries(inputs);
    const outputEdges = outputs.map(([name]) => name);
    const outputTypes = Object.fromEntries(outputs);

    return {
        type,
        name,
        alias,
        inputs: inputEdges,
        inputTypes,
        outputs: outputEdges,
        outputTypes,
        defaultNodeData: defaultNodeData,
    }
}

/**
 * node-list/ 내부적으로 사용하는 inputs/outputs 핸들 정의 헬퍼
 * 
 * 첫번째 인자를 작성하지 않으면 기본 핸들로 적용됨
*/
export const NodeHandle = {
    Input(name = 'default') {
        return [name, HandleTypes.Input] as const;
    },
    Output(name = 'default') {
        return [name, HandleTypes.Output] as const;
    },
    ChatMessages(name = 'default') {
        return [name, HandleTypes.ChatMessages] as const;
    },
    LLMResult(name = 'default') {
        return [name, HandleTypes.LLMResult] as const;
    }
} as const;

export function getHandleColor(name: string, nameTypes: Record<string, string>) {
    const type = nameTypes[name];
    return HandleColors[type]?.value ?? 'grey';
}