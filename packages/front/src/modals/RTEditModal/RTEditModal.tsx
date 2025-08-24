import Button from '@/components/Button';
import { GIcon, GIconButton } from '@/components/GoogleFontIcon';
import { Align, Flex, Grid, Row } from '@/components/layout';
import { Modal, ModalHeader } from '@/components/Modal';
import { EditableText } from '@/components/EditableText';
import TreeView from '@/components/TreeView';

import { LeafNode } from './nodes';
import useRTEditModal from './RTEditModal.hook';
import { t } from 'i18next';

type RTEditModalProps = {
    isFocused: boolean;
    onClose: () => void;
}

function RTEditModal({
    isFocused,
    onClose
}: RTEditModalProps) {
    const {
        action: {
            navigatePromptEditor,
            close,

            tree: treeAction,

            confirmNodeDeletion,
            openRTCreateModal,
            openRTExportModal,
        },
        state: {
            tree,
            disappear,
        }
    } = useRTEditModal({
        isFocused,
        onClose,
    });

    return (
        <Modal
            disappear={disappear}
            style={{
                maxHeight: '80%',
            }}
        >
            <Grid
                columns='1fr'
                rows='2em 24px 2px 1fr 6px 32px'
                style={{
                    height: '100%',
                }}
            >
                <ModalHeader onClose={close}>{t('rt.rt_edit')}</ModalHeader>
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
                        onClick={() => treeAction.addDirectoryNode()}
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
                                onRename={(renamed) => treeAction.renameNode(value, renamed)}
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
                                            treeAction.renameNode(value, renamed);
                                        }}
                                    />
                                </Flex>
                                <DeleteButton
                                    onClick={(e) => {
                                        confirmNodeDeletion(name, value);
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
                        onClick={()=>{
                            // openRTExportModal();
                            close();
                        }}
                        style={{
                            minWidth: '80px',
                            height: '100%'
                        }}
                    >{t('rt.rt_load')}</Button>
                    <Button
                        onClick={() => {
                            openRTCreateModal();
                            close();
                        }}
                        style={{
                            minWidth: '80px',
                            height: '100%'
                        }}
                    >{t('rt.rt_create')}</Button>
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