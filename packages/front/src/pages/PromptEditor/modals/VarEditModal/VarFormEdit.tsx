import { Row } from '@/components/layout';
import { PromptVarForm } from '@/types/prompt-var';

import styles from './styles.module.scss';
import { PromptEditorDataVarAction } from '../../hooks';

type VarFormEditModalProps = {
    varId: string;
    target: PromptVarForm;
    varAction: PromptEditorDataVarAction;
}

/**
 * PromptEditor 변수 편집 모달
 * 
 * @param param0 
 * @returns 
 */
export function VarFormEdit({
    varId,
    target,
    varAction,
}: VarFormEditModalProps) {
    return (
        <Row
            className={styles['modal-wrapper']}
            style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >

        </Row>
    )
}