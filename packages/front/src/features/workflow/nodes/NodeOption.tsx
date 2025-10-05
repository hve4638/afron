import { NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { HandleTypes } from './types';
import { buildNodeData } from './utils';

import Button from '@/components/Button';
import { Align, Column, Gap, Row } from '@/components/layout';

export function NodeOption({ label, value }: { label: string; value?: string }) {
    return (
        <Row
            style={{
                padding: '0 0.5em 0 0.5em',
            }}
            rowAlign={Align.SpaceBetween}
        >
            <div style={{ color: 'rgb(153, 153, 153)' }}>{label}</div>
            <div style={{ color: 'rgb(221, 221, 221)' }}>{value}</div>
        </Row>
    )
}