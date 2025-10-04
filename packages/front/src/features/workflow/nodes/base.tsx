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

export interface BaseNodeProps extends NodeProps {
    children?: React.ReactNode;
}

export function BaseNode({ data, children }: BaseNodeProps) {
    const label = (data['label'] ?? 'Unknown') as string;
    const handles = useMemo(() => {
        const inputs = (data['inputs'] ?? []) as string[];
        const outputs = (data['outputs'] ?? []) as string[];
        const inputTypes = data['inputTypes'] ?? {};
        const outputTypes = data['outputTypes'] ?? {};

        console.log('data', data);

        const maxHandles = Math.max(inputs.length, outputs.length);
        const result: React.ReactNode[] = [];
        for (let i = 0; i < maxHandles; i++) {
            const inputHandle = inputs[i];
            const outputHandle = outputs[i];
            const inputType = inputTypes[inputHandle];
            const outputType = outputTypes[outputHandle];
            const inputColor = inputType ? HandleColors[inputType] : '#da2626ff';
            const outputColor = outputType ? HandleColors[outputType] : '#502a2aff';

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
                                    color: inputColor,
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
                                    color: outputColor,
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


    return (
        <div
            style={{
                backgroundColor: '#333333',
                borderRadius: '4px',
                border: '1px solid #555',
                minWidth: '180px',
                position: 'relative',
                display: 'block',
                fontSize: '12px',
            }}
        >
            <Row rowAlign={Align.Center}>
                {label}
            </Row>
            {handles}
            <Gap h='0.5em'/>
            {children}
        </div>
    );
}