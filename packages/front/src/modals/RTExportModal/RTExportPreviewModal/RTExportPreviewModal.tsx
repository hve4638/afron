import Button from '@/components/atoms/Button';
import { TextForm } from '@/components/FormFields';
import { Align, Gap, Row } from '@/components/layout';
import { Modal } from '@/features/modal';
import { useModalInstance } from '@/features/modal';
import { emitEvent } from '@/hooks/useEvent';
import { useKeyBind } from '@/hooks/useKeyBind';
import { useProfileAPIStore } from '@/stores';
import { ProfileStorage } from '@afron/types';
import { useEffect, useState } from 'react';

type RTMetadata = ProfileStorage.RT.Index;

interface RTExportModalProps {
    rtId: string;
}

function RTExportModal({
    rtId,
}: RTExportModalProps) {
    const { closeModal } = useModalInstance();
    const { api } = useProfileAPIStore();

    const [rtMetadata, setRTMetadata] = useState<RTMetadata>();

    useEffect(() => {
        const loadRTMetadata = async () => {
            const metadata = await api.rt(rtId).getMetadata();
            setRTMetadata(metadata);
        }

        loadRTMetadata();
    }, [rtId, api]);

    return (
        <Modal
            style={{
                height: 'auto',
                maxWidth: '30%',
            }}
            header={{
                label: '내보내기',
                showCloseButton: true,
            }}
            allowEscapeKey={true}
        >
            <TextForm
                name='이름'
                value={rtMetadata?.name ?? ''}
                onChange={(next) => setRTMetadata(prev => ({ ...prev, name: next } as RTMetadata))}
                disabled={true}
            />
            <Gap h='0.5em' />
            <TextForm
                name='버전'
                value={rtMetadata?.version ?? ''}
                onChange={(next) => setRTMetadata(prev => ({ ...prev, version: next } as RTMetadata))}
                disabled={true}
            />

            <Gap h='1em' />
            <Row
                rowAlign={Align.End}
                style={{
                    gap: '0.5em',
                }}
            >
                <Button
                    onClick={() => {
                        emitEvent('export_rt_to_file', { rtId });
                        closeModal();
                    }}
                    style={{
                        minWidth: '80px',
                        height: '100%'
                    }}
                >내보내기</Button>
            </Row>
        </Modal>
    )
}

export default RTExportModal;