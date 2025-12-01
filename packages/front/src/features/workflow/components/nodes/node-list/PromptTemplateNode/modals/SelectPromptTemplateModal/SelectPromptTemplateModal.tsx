import { useState } from 'react';
import classNames from 'classnames';

import { Modal, ModalHeader } from '@/components/modal';
import TreeView, { directory, node, Tree } from '@/components/TreeView';
import { GIcon } from '@/components/atoms/GoogleFontIcon';
import { Align, Flex, Gap, Row } from '@/components/layout';
import { EditableText } from '@/components/atoms/EditableText';

import useModalDisappear from '@/hooks/useModalDisappear';

import styles from './SelectPromptTemplateModal.module.scss';
import Button from '@/components/atoms/Button';
import { Emit } from '@/lib/zustbus';
import { useSelectPromptTemplateModal } from './SelectPromptTemplateModal.hooks';
import type { PromptTemplateEvent } from '../../types';

interface SelectPromptTemplateModalProps {
    onClose: () => void;
    isFocused: boolean;

    rtId: string;
    initPromptId: string | null;
    emitPromptTemplate: Emit<PromptTemplateEvent>;
}

export function SelectPromptTemplateModal({
    onClose = () => { },
    isFocused,

    rtId,
    initPromptId,
    emitPromptTemplate
}: SelectPromptTemplateModalProps) {
    const [disappear, closeModal] = useModalDisappear(onClose);

    const {
        states: {
            tree,
            selected,
        },
        actions: {
            selectPrompt,
            renamePrompt,
            relocateTree,

            openNewPromptTemplateModal,

        }
    } = useSelectPromptTemplateModal({
        closeModal,
        focused: isFocused,

        initPromptId,
        rtId,
        emitPromptTemplate,
    });

    return (
        <Modal
            style={{
                maxWidth: '400px',
            }}
            focused={isFocused}
            onEscapeAction={() => closeModal()}
            disappear={disappear}
            headerLabel={
                <ModalHeader
                    onClose={closeModal}
                >
                    프롬프트 템플릿 선택
                </ModalHeader>
            }
        >
            <TreeView<string | Symbol>
                style={{
                    height: 'auto',
                    minHeight: '1.6em',
                }}
                tree={tree}
                onChange={relocateTree}
                relocatable={true}
                renderLeafNode={({ name, value: valueOrSymbol }) => {
                    if (typeof valueOrSymbol === 'symbol') {
                        return null;
                    }
                    else {
                        const promptId = valueOrSymbol as string;

                        return (
                            <Row
                                className='wfill'
                                onClick={() => {
                                    selectPrompt(promptId);
                                }}
                            >
                                <GIcon
                                    className={classNames({
                                        [styles['selected']]: selected === promptId,
                                    })}
                                    style={{
                                        fontSize: '22px',
                                        width: '22px',
                                        height: '22px',
                                    }}

                                    value='article'
                                />
                                <Flex style={{ paddingLeft: '0.25em' }}>
                                    <EditableText
                                        className={classNames({
                                            [styles['selected']]: selected === promptId,
                                        })}

                                        value={name}
                                        onChange={(renamed) => {
                                            renamePrompt(promptId, renamed);
                                        }}
                                    />
                                </Flex>
                            </Row>
                        );
                    }
                }}
            />
            <Gap h='8px' />
            <Row>
                <Flex />
                <Button
                    className='row'
                    onClick={openNewPromptTemplateModal}
                >
                    <GIcon
                        className={classNames({})}
                        style={{
                            fontSize: '22px',
                            width: '22px',
                            height: '22px',
                        }}

                        value='add'
                    />
                    <span>새 프롬프트</span>
                </Button>
            </Row>
        </Modal>
    )
}