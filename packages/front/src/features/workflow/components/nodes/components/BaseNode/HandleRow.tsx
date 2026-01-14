import { useMemo } from 'react';
import {
    Handle,
    Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import styles from './BaseNode.module.scss';
import { getHandleColor } from '../../utils';


interface HandleRowProps {
    input?: string;
    output?: string;
    inputTypes: Record<string, string>;
    outputTypes: Record<string, string>;
}

export function HandleRow({
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

