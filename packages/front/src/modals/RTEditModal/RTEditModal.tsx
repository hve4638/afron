import Button from '@/components/atoms/Button';
import { GIcon, GIconButton } from '@/components/atoms/GoogleFontIcon';
import { Align, Flex, Grid, Row } from '@/components/layout';
import { Modal, ModalHeader } from '@/features/modal';
import { EditableText } from '@/components/atoms/EditableText';
import TreeView from '@/components/TreeView';

import { LeafNode } from './nodes';
import useRTEditModal from './RTEditModal.hook';
import { t } from 'i18next';
import { emitEvent } from '@/hooks/useEvent';
import { useModalInstance } from '@/features/modal';

function RTEditModal() {
    const { closeModal, disappear } = useModalInstance();
    const {
        state: {
            tree,
        },
        action: {
            tree: treeAction,

            navigatePromptEditor,

            confirmNodeDeletion,
            confirmDirectoryDeletion,
            openRTExportModal,
        },
    } = useRTEditModal();

    return (
        <Modal
            style={{
                maxHeight: '80%',
            }}
            header={{
                label: t('rt.rt_edit'),
                showCloseButton: true,
            }}
        >
            <Grid
                columns='1fr'
                rows='24px 2px 1fr 6px 32px'
            >
                <Row
                    style={{
                        padding: '0px 4px',
                    }}
                    rowAlign={Align.End}
                >
                    <GIconButton
                        style={{
                            fontSize: '22px',
                            width: '22px',
                            height: '22px',
                        }}
                        value='create_new_folder'
                        hoverEffect='square'
                        onClick={() => treeAction.addDirectory()}
                    />
                </Row>
                <div />
                <TreeView<string>
                    tree={tree}
                    onChange={(next) => treeAction.relocate(next)}
                    relocatable={true}
                    renderLeafNode={({ name, value }) => {
                        return (
                            <LeafNode
                                name={name}
                                value={value}
                                onRename={(renamed) => treeAction.rename(value, renamed)}
                                onDelete={() => confirmNodeDeletion(name, value)}
                                onEdit={() => navigatePromptEditor(value)}
                                onExport={() => openRTExportModal(value)}
                            />
                        );
                    }}
                    renderDirectoryNode={({ name, value }) => {
                        return (
                            <>
                                <GIcon
                                    value='folder_open'
                                    style={{
                                        fontSize: '22px',
                                        width: '22px',
                                        height: '22px',
                                    }}
                                />
                                <Flex style={{ paddingLeft: '0.25em' }}>
                                    <EditableText
                                        value={name}
                                        onChange={(renamed) => {
                                            treeAction.rename(value, renamed);
                                        }}
                                    />
                                </Flex>
                                <DeleteButton
                                    onClick={(e) => {
                                        confirmDirectoryDeletion(name, value);
                                        e.stopPropagation();
                                        e.preventDefault();
                                    }}
                                />
                            </>
                        );
                    }}
                />
                <div />
                <Row
                    rowAlign={Align.End}
                    style={{
                        height: '100%',
                        gap: '0.5em',
                    }}
                >
                    <Button
                        onClick={() => {
                            emitEvent('import_rt_from_file');
                            closeModal();
                        }}
                        style={{
                            minWidth: '80px',
                            height: '100%'
                        }}
                    >
                        <Row columnAlign='center' style={{ gap: '0.2em', }}>
                            <GIcon value='folder' />
                            <span>{t('rt.rt_load')}</span>
                        </Row>
                    </Button>
                    <Button
                        onClick={() => {
                            emitEvent('open_new_rt_modal');
                            closeModal();
                        }}
                        style={{
                            minWidth: '80px',
                            height: '100%',
                        }}
                    >
                        <Row columnAlign='center' style={{ gap: '0.2em', }}>
                            <GIcon value='draft' />
                            <span>{t('rt.rt_create')}</span>
                        </Row>
                    </Button>
                </Row>
            </Grid>
        </Modal>
    );
}

function DeleteButton({ onClick }: {
    onClick?: (e: React.MouseEvent<HTMLLabelElement, MouseEvent> | React.KeyboardEvent<HTMLLabelElement>) => void;
}) {
    return (
        <GIconButton
            value='delete'
            style={{
                fontSize: '22px',
                width: '22px',
                height: '22px',
            }}
            hoverEffect='square'
            onClick={onClick}
            onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        />
    );
}

export default RTEditModal;