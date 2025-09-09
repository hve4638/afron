import Button from '@/components/Button';
import { TextForm } from '@/components/forms';
import { Align, Gap, Row } from '@/components/layout';
import { Modal, ModalHeader, ModalRequiredProps } from '@/components/Modal';
import { emitEvent } from '@/hooks/useEvent';
import useHotkey from '@/hooks/useHotkey';
import useModalDisappear from '@/hooks/useModalDisappear';
import { useProfileAPIStore } from '@/stores';
import { t } from 'i18next';
import { useEffect, useState } from 'react';

interface RTExportModalProps extends ModalRequiredProps {
    rtId: string;
}

function RTExportModal({
    rtId,
    isFocused,
    onClose
}: RTExportModalProps) {
    const [disappear, close] = useModalDisappear(onClose);
    const { api } = useProfileAPIStore();

    const [rtMetadata, setRTMetadata] = useState<RTIndex>();

    const loadRTMetadata = async () => {
        const metadata = await api.rt(rtId).getMetadata();
        setRTMetadata(metadata);
    }

    useEffect(() => {
        loadRTMetadata();
    }, [rtId, api]);

    useHotkey({
        'Escape': close,
    }, isFocused, []);

    return (
        <Modal
            disappear={disappear}
            headerLabel={
                <ModalHeader
                    onClose={close}
                >내보내기</ModalHeader>
            }
            style={{
                height: 'auto',
                maxWidth: '30%',
            }}
        >
            <TextForm
                name='이름'
                value={rtMetadata?.name ?? ''}
                onChange={(next) => setRTMetadata(prev => ({ ...prev, name: next } as RTIndex))}
                disabled={true}
            />
            <Gap h='0.5em' />
            <TextForm
                name='버전'
                value={rtMetadata?.version ?? ''}
                onChange={(next) => setRTMetadata(prev => ({ ...prev, version: next } as RTIndex))}
                disabled={true}
            />
            {/* <Gap h='0.5em' />
            <TextForm
                name='ID'
                value={rtMetadata?.id ?? ''}
                onChange={(next) => setRTMetadata(prev => ({ ...prev, version: next } as RTIndex))}
                disabled={true}
            /> */}

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
                        close();
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