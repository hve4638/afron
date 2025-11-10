import { useMemo } from 'react';
import {
    Handle,
    Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { WorkflowNodeData } from '../../types';

import styles from './BaseNode.module.scss';
import { getHandleColor } from '../../utils';

interface useBaseNodeProps {
    data: WorkflowNodeData<object, string>;
}

export function useBaseNode({
    data,
}: useBaseNodeProps) {
    const defaultHandles = useMemo(() => {
        const result: React.ReactNode[] = [];
        if (data.inputs.includes('default')) {
            const color = getHandleColor('default', data.inputTypes);
            result.push(
                <Handle
                    key='handle-default-target'
                    type='target'
                    position={Position.Left}
                    id={'default'}
                    style={{
                        background: color,
                    }}
                />
            );
        }
        if (data.outputs.includes('default')) {
            const color = getHandleColor('default', data.outputTypes);
            result.push(
                <Handle
                    key='handle-default-source'
                    type='source'
                    position={Position.Right}
                    id={'default'}
                    style={{
                        background: color,
                    }}
                />
            );
        }

        return result;
    }, [data]);
    const handles = useMemo(() => {
        const result: React.ReactNode[] = [];
        let inputs = data.inputs;
        if (inputs.includes('default')) {
            if (inputs.length > 1) {
                console.warn(`Default input should be the only input. (${data})`);
            }
            inputs = [];
        }

        let outputs = data.outputs;
        if (outputs.includes('default')) {
            if (outputs.length > 1) {
                console.warn(`Default output should be the only output. (${data})`);
            }
            outputs = [];
        }

        const maxHandles = Math.max(inputs.length, outputs.length);
        for (let i = 0; i < maxHandles; i++) {
            result.push(
                <HandleRow
                    key={`handle-row-${i}`}
                    input={inputs.at(i)}
                    output={outputs.at(i)}
                    inputTypes={data.inputTypes}
                    outputTypes={data.outputTypes}
                />
            );
        }

        return result;
    }, [data]);

    return {
        defaultHandles,
        handles
    };
}

interface HandleRowProps {
    input?: string;
    output?: string;
    inputTypes: Record<string, string>;
    outputTypes: Record<string, string>;
}

function HandleRow({
    input, output,
    inputTypes, outputTypes,
}: HandleRowProps) {
    return (
        <div
            style={{
                position: 'relative',
                height: '1.5em',
            }}
        >
            {
                input != null &&
                <>
                    <Handle
                        type='target'
                        position={Position.Left}
                        id={input}
                        style={{
                            background: getHandleColor(input, inputTypes),
                            position: 'absolute',
                        }}
                    />
                    <div
                        className={styles['handle-name']}
                        style={{
                            position: 'absolute',
                            left: '0.6em',
                        }}
                    >
                        {input}
                    </div>
                </>
            }
            {
                output != null &&
                <>
                    <Handle
                        type='source'
                        position={Position.Right}
                        id={output}
                        style={{
                            background: getHandleColor(output, outputTypes),
                            position: 'absolute',
                        }}
                    />
                    <div
                        className={styles['handle-name']}
                        style={{
                            position: 'absolute',
                            right: '0.6em',
                        }}
                    >
                        {output}
                    </div>
                </>
            }
        </div>
    )
}

