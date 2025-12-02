import classNames from 'classnames';

import { Modal, ModalHeader } from '@/components/modal';
import TreeView from '@/components/TreeView';
import { GIcon } from '@/components/atoms/GoogleFontIcon';
import { Flex, Gap, Row } from '@/components/layout';
import { EditableText } from '@/components/atoms/EditableText';

import styles from './SelectPromptTemplateModal.module.scss';
import Button from '@/components/atoms/Button';
import { Emit } from '@/lib/zustbus';
import { useSelectPromptTemplateModal } from './SelectPromptTemplateModal.hooks';
import type { PromptTemplateEvent } from '../../types';

interface SelectPromptTemplateModalProps {
    rtId: string;
    initPromptId: string | null;
    emitPromptTemplate: Emit<PromptTemplateEvent>;
}

export function SelectPromptTemplateModal({
    rtId,
    initPromptId,
    emitPromptTemplate
}: SelectPromptTemplateModalProps) {
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
        initPromptId,
        rtId,
        emitPromptTemplate,
    });

    return (
        <Modal
            style={{
                maxWidth: '400px',
            }}
            header={{
                label: '프롬프트 템플릿 선택',
                showCloseButton: true,
            }}
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