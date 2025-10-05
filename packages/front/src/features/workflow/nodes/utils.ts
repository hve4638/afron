import { HandleCompatibility } from './data';
import { HandleTypes } from './types';

type EdgeInfo = [string, typeof HandleTypes[keyof typeof HandleTypes]];

export function buildNodeData(
    label: string,
    inputs: EdgeInfo[],
    outputs: EdgeInfo[],
) {
    const inputEdges = inputs.map(([name]) => name);
    const inputTypes = Object.fromEntries(inputs);
    const outputEdges = outputs.map(([name]) => name);
    const outputTypes = Object.fromEntries(outputs);
    
    return {
        label,
        inputs: inputEdges,
        inputTypes,
        outputs: outputEdges,
        outputTypes,
    }
}

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