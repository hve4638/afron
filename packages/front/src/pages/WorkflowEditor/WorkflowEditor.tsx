import { Workflow } from '@/features/workflow';
import { useWorkflowEditor } from './WorkflowEditor.hook';

import styles from './WorkflowEditor.module.scss';
import { Grid, Row } from '@/components/layout';
import useTrigger from '@/hooks/useTrigger';

export function WorkflowEditor() {
    const { nodes, edges, dataRef } = useWorkflowEditor();
    const [refreshCount, refresh] = useTrigger();

    if (nodes == null || edges == null) {
        return <></>;
    }

    return (
        <Grid
            className={styles['workflow-editor']}
            rows='40px 1fr'
            columns='auto'
        >
            <Row>Header</Row>
            <Workflow
                nodes={nodes}
                edges={edges}
                data={dataRef}
                refresh={refresh}
            />
        </Grid >
    );
}