import { Workflow } from '@/features/workflow';
import { useWorkflowEditor } from './WorkflowEditor.hook';

import styles from './WorkflowEditor.module.scss';
import { Align, Column, Flex, Gap, Grid, Row } from '@/components/layout';
import { GIconButton } from '@/components/GoogleFontIcon';

export function WorkflowEditor() {
    const {
        workflow: {
            nodes,
            edges,
            flowData,
            setFlowData,
            setFlowNode,
            setFlowEdges,
        },

        save,
        close,
    } = useWorkflowEditor();

    return (
        <Grid
            className={styles['workflow-editor']}
            rows='40px 1fr'
            columns='auto'
            // columns='40px auto'
        >
            <Row
                columnAlign={Align.Center}
                style={{
                    padding: '0 0.5em',
                    // gridColumn: 'span 2',
                }}
            >
                <span>Workflow Editor</span>
                <Flex />
                <GIconButton
                    style={{ fontSize: '30px' }}
                    value='close'
                    hoverEffect='square'
                    onClick={close}
                />
            </Row>
            {
                nodes != null &&
                edges != null &&
                <Workflow
                    nodes={nodes}
                    edges={edges}
                    data={flowData}
                    onNodesChange={setFlowNode}
                    onEdgesChange={setFlowEdges}
                    onDataChange={setFlowData}
                ></Workflow>
            }
        </Grid >
    );
}