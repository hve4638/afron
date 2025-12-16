import { MockModal } from '../../components/MockModal';
import { Button, Well } from '@/components/atoms';
import { Align, Flex, Grid, Row } from '@/components/layout';

export function ModalDemo() {
    return (
        <MockModal title="Modal Demo">
            <div style={{
                fontSize: '0.9em',
                padding: '4px 0.5em 1em 0.5em',
            }}>
                Modal content goes here
            </div>
            <Grid
                style={{
                    height: '3em',
                }}
                rows='auto'
                columns='1fr 1fr'
            >
                <div>card</div>
                <Well>well</Well>
            </Grid>
            <Flex />
            <Row rowAlign={Align.End}>
                <Button style={{ width: '90px' }}>
                    확인
                </Button>
                <Button style={{ width: '90px', marginLeft: '6px' }}>
                    취소
                </Button>
            </Row>
        </MockModal>
    );
}
