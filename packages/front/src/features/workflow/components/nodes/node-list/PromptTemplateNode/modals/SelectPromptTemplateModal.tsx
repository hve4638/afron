import { useState } from 'react';
import classNames from 'classnames';

import { Modal, ModalHeader } from '@/components/Modal';
import TreeView, { directory, node, Tree } from '@/components/TreeView';
import { GIcon } from '@/components/GoogleFontIcon';
import { Align, Flex, Gap, Row } from '@/components/layout';
import { EditableText } from '@/components/EditableText';

import useModalDisappear from '@/hooks/useModalDisappear';
import useHotkey from '@/hooks/useHotkey';

import styles from './SelectPromptTemplateModal.module.scss';
import Button from '@/components/Button';
import { Emit } from '@/lib/zustbus';
import { PromptTemplateEvent } from '../PromptTemplateOption.hooks';
import { useModal } from '@/hooks/useModal';
import { NewPromptTemplateModal } from './NewPromptTemplateModal';

interface SelectPromptTemplateModalProps {
    onClose: () => void;
    isFocused: boolean;

    promptId: string | null;
    emitPromptTemplate: Emit<PromptTemplateEvent>;
}

export function SelectPromptTemplateModal({
    onClose = () => { },
    isFocused,

    promptId,
    emitPromptTemplate
}: SelectPromptTemplateModalProps) {
    const modals = useModal();
    const [disappear, close] = useModalDisappear(onClose);

    const [tree, setTree] = useState<Tree<string | Symbol>>([
        node('File 1', 'file1 content'),
        node('File 2', 'file2 content'),
        node('File 1', 'file3 content'),
        node('File 2', 'file4 content'),
        node('File 1', 'file5 content'),
    ]);
    const [selected, setSelected] = useState<string | null>(promptId);

    return (
        <Modal
            style={{
                maxWidth: '400px',
                // paddingBottom: ''
            }}
            focused={isFocused}
            onEscapeAction={() => close()}
            disappear={disappear}
            headerLabel={
                <ModalHeader
                    onClose={close}
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
                onChange={(next) => setTree(next)}
                relocatable={true}
                renderLeafNode={({ name, value: valueOrSymbol }) => {
                    if (typeof valueOrSymbol === 'symbol') {
                    }
                    else {
                        const value = valueOrSymbol as string;

                        return (
                            <Row
                                className='wfill'
                                onClick={() => {
                                    emitPromptTemplate('select_prompt_id', { promptId: value });
                                    setSelected(value);
                                }}
                            >
                                <GIcon
                                    className={classNames({
                                        [styles['selected']]: selected === value,
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
                                            [styles['selected']]: selected === value,
                                        })}

                                        value={name}
                                        onChange={(renamed) => {
                                            setTree((prev) => {
                                                const next = [...prev];
                                                const index = next.findIndex((item) => item.name === name);
                                                if (index !== -1) {
                                                    next[index] = { ...next[index], name: renamed };
                                                }
                                                return next;
                                            });
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
                    onClick={() => {
                        modals.open(NewPromptTemplateModal, {
                            emitPromptTemplate,
                        });
                    }}
                >
                    <GIcon
                        className={classNames({
                        })}
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