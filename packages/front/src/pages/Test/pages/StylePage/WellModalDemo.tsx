import { MockModal } from '../../components/MockModal';
import { Button, Well } from '@/components/atoms';
import { Align, Column, Flex, Row } from '@/components/layout';
import { useState } from 'react';

export function WellModalDemo() {
    return (
        <MockModal title="Well Modal Demo">
            <Column style={{
                padding: '0.5em',
            }}>
                <Well>
                    <Column style={{ width: '100%' }}>
                        <Well.Item hoverable selected>1111</Well.Item>
                        <Well.Item hoverable>2</Well.Item>
                        <Well.Item hoverable>3</Well.Item>
                        <Well.Item hoverable>4</Well.Item>
                        <Well.Item hoverable>5</Well.Item>
                    </Column>
                </Well>
            </Column>
        </MockModal>
    );
}
