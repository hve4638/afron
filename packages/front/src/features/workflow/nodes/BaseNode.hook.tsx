import { useCallback, useMemo } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    BackgroundVariant,
    type OnConnect,
    Handle,
    Position,
    type NodeProps,
    type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Align, Gap, Row } from '@/components/layout';
import { HandleTypes, HandleColors } from './types';
import { CommonProps } from '@/types';
import classNames from 'classnames';

interface useBaseNodeProps {
    data: Record<string, unknown>;
}

export function useBaseNode({
    data,
}: useBaseNodeProps) {
    const handles = useMemo(() => {
        const inputs = (data['inputs'] ?? []) as string[];
        const outputs = (data['outputs'] ?? []) as string[];
        const inputTypes = data['inputTypes'] ?? {};
        const outputTypes = data['outputTypes'] ?? {};

        const maxHandles = Math.max(inputs.length, outputs.length);
        const result: React.ReactNode[] = [];
        for (let i = 0; i < maxHandles; i++) {
            const inputHandle = inputs[i];
            const outputHandle = outputs[i];
            const inputType = inputTypes[inputHandle];
            const outputType = outputTypes[outputHandle];
            const inputColor = inputType ? HandleColors[inputType].value : '#da2626ff';
            const outputColor = outputType ? HandleColors[outputType].value : '#502a2aff';

            result.push(
                <div
                    key={`handle-row-${i}`}
                    style={{
                        position: 'relative',
                        height: '1.5em',
                    }}
                >
                    {
                        inputs.length > i &&
                        <>
                            <Handle
                                type='target'
                                position={Position.Left}
                                id={inputs[i]}
                                style={{
                                    background: inputColor,
                                    position: 'absolute',
                                }}
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    left: '0.6em',
                                    color: 'rgb(153, 153, 153)',
                                }}
                            >
                                {inputs[i]}
                            </div>
                        </>
                    }
                    {
                        outputs.length > i &&
                        <>
                            <Handle
                                type='source'
                                position={Position.Right}
                                id={outputs[i]}
                                style={{
                                    background: outputColor,
                                    position: 'absolute',
                                }}
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    right: '0.6em',
                                    color: 'rgb(153, 153, 153)',
                                }}
                            >
                                {outputs[i]}
                            </div>
                        </>
                    }
                </div>
            )
        }

        return result;
    }, [data]);

    return { handles };
}