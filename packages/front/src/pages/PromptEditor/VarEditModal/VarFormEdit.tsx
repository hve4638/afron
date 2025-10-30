import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import FocusLock from 'react-focus-lock';
import { ModalBackground, ModalBox, ModalHeader } from 'components/Modal';
import { StringForm } from '@/components/forms';

import {
    Additions,
} from './additions';
import useTrigger from '@/hooks/useTrigger';
import { dropdownItem, initRTVar } from './utils';
import styles from './styles.module.scss';
import { Row } from 'components/layout';
import { MODAL_DISAPPEAR_DURATION } from 'data'
import useModalDisappear from '@/hooks/useModalDisappear';
import useHotkey from '@/hooks/useHotkey';
import { useTranslation } from 'react-i18next';
import DropdownForm, { Dropdown } from '@/components/forms/DropdownForm';
import { RTVarForm } from '@afron/types';
import { PromptEditorData, PromptEditorDataAction, PromptEditorDataGetter, PromptEditorDataVarAction } from '../hooks';
import { PromptVar, PromptVarForm } from '@/types/prompt-var';
import { VAR_DROPDOWN_ITEMS } from './constants';

type VarFormEditModalProps = {
    varId: string;
    target: PromptVarForm;
    varAction: PromptEditorDataVarAction;

    onClose: () => void;
}

/**
 * PromptEditor 변수 편집 모달
 * 
 * @param param0 
 * @returns 
 */
function VarFromEditModal({
    varId,
    target,
    varAction,

    onClose
}: VarFormEditModalProps) {
    const { t } = useTranslation();
    const [disappear, close] = useModalDisappear(onClose);

    const [warnVarNameDuplication, setWarnVarNameDuplication] = useState(false);

    const fieldRef = useRef<PromptVarForm | null>(null);

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
            <ModalBox
                className={styles['var-editor-modal']}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25em',
                }}

                disappear={disappear}
            >
                <ModalHeader onClose={close}>{t('form_editor.title')}</ModalHeader>
                <DropdownForm
                    label={t('form_editor.type_label')}
                    value={target.data.type}
                    onChange={(nextType) => {
                        varAction.setData(varId, (prev) => ({
                            ...prev,
                            type: nextType,
                        }));
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
                <StringForm
                    name={t('form_editor.name_label')}
                    warn={
                        warnVarNameDuplication
                            ? '변수명이 중복되었습니다'
                            : undefined
                    }

                    value={target.name}
                    onChange={(name) => {
                        varAction.setName(varId, name);
                    }}
                    width='10em'
                />
                <StringForm
                    style={{ marginTop: '0px' }}

                    name={t('form_editor.display_name_label')}
                    value={target.form_name}
                    onChange={(displayName) => {
                        varAction.setFormName(varId, displayName);
                    }}
                    width='10em'
                />
                <Additions
                    target={target}
                    fieldVarRef={fieldRef}
                    onRefresh={triggerRefresh}
                />
            </ModalBox>
            {
                (
                    target.type == 'struct'
                    || (target.type === 'array' && target.element?.type === 'struct')
                ) &&
                fieldRef.current != null &&
                <>
                    <div style={{ width: '8px' }} />
                    <ModalBox
                        className={styles['var-editor-modal']}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.25em',
                        }}
                        disappear={disappear}
                    >
                        <ModalHeader
                            onClose={() => {
                                fieldRef.current = null;
                                triggerRefresh();
                            }}
                        >필드 편집</ModalHeader>
                        <DropdownForm<PromptVarType>
                            label='타입'

                            value={fieldRef.current.type}
                            onChange={(next) => {
                                if (!fieldRef.current) return;
                                fieldRef.current.type = next;
                                triggerRefresh();
                            }}
                        >
                            {FIELD_DROPDOWN_ITEMS.map(({ name, value }, i) => (
                                <Dropdown.Item key={i} name={name} value={value} />
                            ))}
                        </DropdownForm>
                        <StringForm
                            name='변수명'
                            value={fieldRef.current.name}
                            onChange={(name) => {
                                if (!fieldRef.current) return;
                                fieldRef.current.name = name;
                                triggerRefresh();
                            }}
                            width='10em'
                        />
                        <StringForm
                            name='표시되는 변수명'
                            value={fieldRef.current.display_name}
                            onChange={(displayName) => {
                                if (!fieldRef.current) return;
                                fieldRef.current.display_name = displayName;
                                triggerRefresh();
                            }}
                            width='10em'
                        />
                        <Additions
                            target={fieldRef.current}
                            fieldVarRef={null}
                            onRefresh={triggerRefresh}
                        />
                    </ModalBox>
                </>
            }
        </Row>
    )
}

export default VarEditModal;