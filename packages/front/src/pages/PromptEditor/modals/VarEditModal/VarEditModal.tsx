import FocusLock from 'react-focus-lock';
import { ModalBackground, ModalBox, ModalHeader } from '@/components/modal';

import styles from './styles.module.scss';
import { Row } from 'components/layout';
import { useTranslation } from 'react-i18next';
import { PromptEditorData, PromptEditorDataAction, PromptEditorDataGetter } from '../../hooks';
import { useVarEditModal } from './VarEditModal.hooks';
import { FieldEditor, FormEditor } from './FormEditor';
import useModalDisappear from '@/hooks/useModalDisappear';

type VarEditModalProps = {
    varId: string;

    promptEditorData: PromptEditorData;
}

/**
 * PromptEditor 변수 편집 모달
 * 
 * @param param0 
 * @returns 
 */
export function VarEditModal({
    varId,
    promptEditorData,
}: VarEditModalProps) {
    const { t } = useTranslation();
    const {
        promptVar,
        emitVarEditModalControl,

        secondEditorData,
    } = useVarEditModal({
        varId, promptEditorData
    });

    return (
        <ModalBackground
        
        >
            {
                // @TODO : 원래 ModalProvider에서 FocusLock을 제공해야 하지만 작동하지 않아 직접 추가
                // 추후 수정 필요
            }
            <FocusLock>
                <Row
                    className={styles['modal-wrapper']}
                    style={{
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {
                        promptVar.include_type === 'form' &&
                        <FormEditor
                            varId={varId}
                            target={promptVar}
                            varAction={promptEditorData.varAction}
                            emitVarFormEditModalControl={emitVarEditModalControl}
                        />
                    }
                    {
                        secondEditorData?.type === 'struct' &&
                        promptVar.include_type === 'form' &&
                        promptVar.data.type === 'struct' &&
                        <FieldEditor
                            varId={varId}
                            fieldName={secondEditorData.fieldName}
                            target={promptVar}
                            varAction={promptEditorData.varAction}
                            emitVarFormEditModalControl={emitVarEditModalControl}
                        />
                    }
                </Row>
            </FocusLock>
        </ModalBackground>
    )
}