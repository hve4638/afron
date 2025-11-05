import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalBox, ModalHeader } from '@/components/Modal';
import { PromptVarForm } from '@/types/prompt-var';

import { PromptEditorDataVarAction } from '../../../hooks';
import { DropdownForm, Form } from '@/components/forms';
import { VAR_DROPDOWN_ITEMS } from '../constants';
import Dropdown from '@/components/ui/Dropdown';
import { Additions } from './additions';
import { Emit } from '@/lib/zustbus';
import { VarEditModalControlEvent } from '../types';
import styles from './styles.module.scss';

type VarFormEditModalProps = {
    varId: string;
    target: PromptVarForm;
    varAction: PromptEditorDataVarAction;

    emitVarFormEditModalControl: Emit<VarEditModalControlEvent>;

    disappear: boolean;
}

export function FormEditor({
    varId,
    target,
    varAction,

    emitVarFormEditModalControl,

    disappear,
}: VarFormEditModalProps) {
    const { t } = useTranslation();
    const [warnNameDuplication, setWarnNameDuplication] = useState(false);
    const nameWarnText = useMemo(() => (
        warnNameDuplication
            ? '변수명이 중복되었습니다'
            : undefined
    ), [warnNameDuplication]);
    
    return (
        <ModalBox
            className={styles['var-editor-modal']}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25em',
            }}

            disappear={disappear}
        >
            <ModalHeader onClose={() => {
                emitVarFormEditModalControl('close_modal');
            }}>{t('form_editor.title')}</ModalHeader>
            <DropdownForm
                label={t('form_editor.type_label')}
                value={target.data.type}
                onChange={(next) => {
                    varAction.setDataType(varId, next);

                    if (next !== 'struct') {
                        emitVarFormEditModalControl('close_2rd_editor');
                    }
                }}
            >
                {
                    VAR_DROPDOWN_ITEMS.map(({ name, value }, i) => (
                        <Dropdown.Item
                            key={i}
                            name={name}
                            value={value}
                        />
                    ))
                }
            </DropdownForm>
            <Form.String
                name={t('form_editor.name_label')}
                warn={nameWarnText}

                value={target.name}
                onChange={(name) => {
                    try {
                        varAction.setName(varId, name);
                    }
                    catch (e) {
                        setWarnNameDuplication(true);
                        return;
                    }
                }}
                width='10em'
            />
            <Form.String
                style={{ marginTop: '0px' }}

                name={t('form_editor.display_name_label')}
                value={target.form_name}
                onChange={(displayName) => {
                    varAction.setFormName(varId, displayName);
                }}
                width='10em'
            />
            <Additions
                varId={varId}
                varAction={varAction}

                dataType={target.data.type}
                config={target.data.config[target.data.type]!}
                onConfigChange={(next) => {
                    varAction.setDataConfig(varId, target.data.type, next);
                }}
            />
        </ModalBox >
    )
}