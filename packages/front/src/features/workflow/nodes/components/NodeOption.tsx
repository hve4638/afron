import { Align, Row } from '@/components/layout';

/**
 * 노드 옵션 표시
 */
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