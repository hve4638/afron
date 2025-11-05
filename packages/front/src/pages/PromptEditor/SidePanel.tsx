import classNames from 'classnames';
import { useTranslation } from "react-i18next";
import styles from './styles.module.scss';

import { Align, Column, Flex, Row } from "@/components/layout";
import { GIconButton, GoogleFontIcon } from '@/components/GoogleFontIcon';
import Button from '@/components/Button';

import { useModal } from '@/hooks/useModal';
import useHotkey from '@/hooks/useHotkey';

import type { PromptData } from '@/types';
import { EditableText } from '@/components/EditableText';
import { PromptEditorDataAction } from './hooks';
import { Emit, UseOn } from '@/lib/zustbus';
import { PromptEditorEvent } from './types';
import { useEffect, useState } from 'react';

type SidePanelProps = {
    value: Readonly<PromptData>;
    action: Readonly<PromptEditorDataAction>;

    emitPromptEditorEvent: Emit<PromptEditorEvent>;
    usePromptEditorEvent: UseOn<PromptEditorEvent>;
}

function SidePanel({
    value,
    action,
    emitPromptEditorEvent,
    usePromptEditorEvent,
}: SidePanelProps) {
    const { t } = useTranslation();
    const modal = useModal();
    const [saved, setSaved] = useState(false);

    useHotkey({
        's': (e) => {
            if (e.ctrlKey) {
                emitPromptEditorEvent('save');

                return true;
            }
        }
    }, modal.count === 0);

    usePromptEditorEvent('on_save', () => setSaved(true), []);

    useEffect(() => {
        if (!saved) return;
        const timeoutId = window.setTimeout(() => {
            setSaved(false);
        }, 300);

        return () => {
            window.clearTimeout(timeoutId);
        }
    }, [saved]);

    return <Column
        className={styles['edit-panel']}
        style={{
            width: '100%',
            height: '100vh',
            overflowY: 'auto',
        }}
    >
        <Row
            style={{
                width: '100%',
                height: '2em',
            }}
            columnAlign={Align.Center}
        >
            <EditableText
                value={value.name ?? ''}
                editable={true}
                onChange={(name) => {
                    action.setName(name);
                }}
            />
            {/* <strong
                style={{
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}
            >{data.name}</strong> */}
            <GIconButton
                className='noflex'
                style={{
                    fontSize: '1.5em',
                    cursor: 'pointer',
                    margin: '4px'
                }}
                value='settings'
                onClick={() => emitPromptEditorEvent('open_prompt_only_config_modal')}
                hoverEffect='circle'
            />
            <GIconButton
                className='noflex'
                style={{
                    fontSize: '1.5em',
                    cursor: 'pointer',
                    margin: '4px'
                }}
                value='close'
                onClick={() => emitPromptEditorEvent('back')}
                hoverEffect='square'
            />
        </Row>
        <div style={{ height: '1em' }} />
        {/* <h2
            className='undraggable'
            style={{
                marginBottom: '4px'
            }}
        >{'프롬프트'}</h2> */}
        {/* <DropdownOldForm
            name='요청 형태'
            value={data.inputType}
            items={[
                { name: '일반', key: PromptInputType.NORMAL },
                { name: '채팅', key: PromptInputType.CHAT },
            ]}
            onChange={(select)=>onChangeInputType(select.key as PromptInputType)}
            onItemNotFound={()=>onChangeInputType(PromptInputType.NORMAL)}
        /> */}
        {/* <hr/> */}
        <h2
            className='undraggable'
            style={{
                marginBottom: '4px'
            }}
        >{'변수'}</h2>
        <div
            style={{
                display: 'block',
                width: '100%',
                overflowY: 'auto',
            }}
        >
            {
                value.variables.map((item, index) => (
                    <Row
                        key={index}
                        className={
                            classNames(
                                'undraggable',
                                'row-button'
                            )
                        }
                        style={{
                            width: '100%',
                            height: '36px',
                            padding: '4px 8px'
                        }}
                        onClick={() => {
                            console.log('item.', item);
                            emitPromptEditorEvent('open_varedit_modal', { varId: item.id });
                        }}
                    >
                        <span>{item.name}</span>
                        <Flex />
                        <GoogleFontIcon
                            enableHoverEffect={true}
                            style={{
                                fontSize: '20px',
                                cursor: 'pointer',
                                margin: 'auto 4px',
                                width: '28px',
                                height: '28px',
                            }}
                            value='delete'
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                action.removeVar(item.id);
                            }}
                        />
                    </Row>
                ))
            }
        </div>
        <div
            className={classNames(
                'undraggable center',
                styles['add-var-button']
            )}
            onClick={() => {
                const varId = action.addVar();

                if (!varId) return;
                emitPromptEditorEvent('open_varedit_modal', { varId });
            }}
        >
            <GoogleFontIcon
                value='add_circle'
            />
            <span
                style={{
                    marginLeft: '0.5em',
                }}
            >
                {t('prompt_editor.add_form_label')}
            </span>
        </div>
        <Flex />
        {/* <CheckBoxForm
            name='프롬프트 미리보기'
            checked={true}
            onChange={(checked)=>{}}
        /> */}
        <Row
            className='noflex'
            style={{
                width: '100%',
                height: '48px',
                padding: '8px 0px'
            }}
        >
            <Button
                disabled={saved}
                className={styles['save-button']}
                style={{
                    width: '100%',
                    height: '100%',
                }}
                onClick={() => emitPromptEditorEvent('save')}
            >
                {
                    saved
                        ? t('prompt_editor.saved_label')
                        : t('prompt_editor.save_label')
                }
            </Button>
        </Row>
    </Column>
}

export default SidePanel;