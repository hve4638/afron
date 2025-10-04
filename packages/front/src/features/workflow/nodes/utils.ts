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