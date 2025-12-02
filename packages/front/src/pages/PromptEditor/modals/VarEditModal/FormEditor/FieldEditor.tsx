import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Row } from '@/components/layout';
import { ModalBox, ModalHeader } from '@/components/modal';
import useModalDisappear from '@/hooks/useModalDisappear';
import { PromptVarForm } from '@/types/prompt-var';

import { PromptEditorDataVarAction } from '../../../hooks';
import styles from './styles.module.scss';
import { DropdownForm, Field, StringForm } from '@/components/FormFields';
import { FIELD_DROPDOWN_ITEMS, VAR_DROPDOWN_ITEMS } from '../constants';
import Dropdown from '@/components/atoms/Dropdown';
import { Additions } from './additions';
import { Emit } from '@/lib/zustbus';
import { VarEditModalControlEvent } from '../types';

type VarFormEditModalProps = {
    varId: string;
    fieldName: string;
    target: PromptVarForm;
    varAction: PromptEditorDataVarAction;

    emitVarFormEditModalControl: Emit<VarEditModalControlEvent>;
}

export function FieldEditor({
    varId,
    fieldName,
    target,
    varAction,

    emitVarFormEditModalControl,
}: VarFormEditModalProps) {
    const structConfig = target.data.config.struct ?? { fields: [] };
    const field = useMemo(() => {
        return structConfig.fields.find(f => f.name === fieldName)!;
    }, [target, fieldName]);

    return (
        <ModalBox
            className={styles['var-editor-modal']}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25em',
            }}
        >
            <ModalHeader
                onClose={() => {
                    emitVarFormEditModalControl('close_2rd_editor');
                }}
            >필드 편집</ModalHeader>
            <DropdownForm
                label='타입'
                value={field.type}
                onChange={(next) => {
                    varAction.setFieldType(varId, field.name, next);
                }}
            >
                {FIELD_DROPDOWN_ITEMS.map(({ name, value }, i) => (
                    <Dropdown.Item key={i} name={name} value={value} />
                ))}
            </DropdownForm>
            <StringForm
                name='변수명'
                value={field.name}
                onChange={(name) => {
                    varAction.setFieldName(varId, field.name, name);
                }}
                width='10em'
            />
            <StringForm
                name='표시되는 변수명'
                value={field.display_name}
                onChange={(displayName) => {
                    varAction.setFieldDisplayName(varId, field.name, displayName);
                }}
                width='10em'
            />
            <Additions
                varId={varId}
                varAction={varAction}

                dataType={field.type}
                config={field.config[field.type]!}
                onConfigChange={(next) => {
                    varAction.setFieldConfig(varId, field.name, field.type, next as any);
                }}
            />
        </ModalBox>
    )
}