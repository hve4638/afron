import { Modal } from '@/features/modal';
import { Align, Row } from '@/components/layout';
import Button from '@/components/atoms/Button';

import { ConfirmDialog, DeleteConfirmDialog } from '@/modals/Dialog';

import styles from './styles.module.scss';
import ListView from '@/components/container/ListView/ListView';
import { useModal } from '@/features/modal';

interface RecoverProfileModalProps {
    orphanIds: string[];
    onRecovery: () => Promise<void>;
}

function RecoverProfileModal({
    orphanIds,
    onRecovery,
}: RecoverProfileModalProps) {
    const modal = useModal();

    return (
        <Modal
            header={{
                label: '프로필 복구',
                showCloseButton: true,
            }}
            allowEscapeKey={true}
        >
            <small>예기치 못한 오류로 문제가 생긴 프로필을 복구합니다</small>
            <div style={{ height: '0.25em' }} />
            <ListView
                className='undraggable'
                style={{
                    padding: '0 0.5em',
                }}
            >
                {
                    orphanIds.map((id) => (
                        <div>{id}</div>
                    ))
                }
                {
                    orphanIds.length === 0 &&
                    <div className='subtle-text'>없음</div>
                }
            </ListView>
            <div style={{ height: '8px' }} />

            <Row
                rowAlign={Align.End}
                style={{
                    width: '100%',
                    height: '32px',
                    gap: '12px',
                }}
            >
                <Button
                    className='green'
                    style={{
                        width: '128px',
                        height: '100%'
                    }}
                    onClick={async () => {
                        modal.open(
                            <ConfirmDialog
                                title='프로필 복구'
                                onConfirm={() => {
                                    onRecovery();
                                    close();
                                    return true;
                                }}
                            >
                                <div>복구하시겠습니까?</div>
                            </ConfirmDialog>
                        );
                    }}
                    disabled={orphanIds.length === 0}
                >복구</Button>
                <Button
                    className='transparent'
                    style={{
                        width: '128px',
                        height: '100%'
                    }}
                    onClick={() => close()}
                >취소</Button>
            </Row>
        </Modal>
    )
}

export default RecoverProfileModal;