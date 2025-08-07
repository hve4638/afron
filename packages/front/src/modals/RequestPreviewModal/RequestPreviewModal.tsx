import { Modal, ModalHeader } from '@/components/Modal';
import Well from '@/components/ui/Well';
import useHotkey from '@/hooks/useHotkey';
import useModalDisappear from '@/hooks/useModalDisappear';
import { useMemo } from 'react';

type RequestPreviewModalProps = {
    previewData: RTEventPreviewData;
    isFocused: boolean;
    onClose: () => void;
}

function RequestPreviewModal({
    previewData,
    isFocused,
    onClose
}: RequestPreviewModalProps) {
    const [disappear, close] = useModalDisappear(onClose);
    const headersJSON = useMemo(() => {
        return JSON.stringify(previewData.headers, null, 4)
            .split('\n')
            .map(line => <div>{line}</div>)
    }, [previewData.headers]);
    const bodyJSON = useMemo(() => {
        return JSON.stringify(previewData.data, null, 4)
            .split('\n')
            .map(line => <div>{line}</div>)
    }, [previewData.data]);

    useHotkey({
        'Escape': close,
    }, isFocused, []);

    console.log('# RequestPreviewModal', previewData);

    return (
        <Modal
            disappear={disappear}
            onClose={close}
            style={{
                maxHeight: '95%',
                overflowY: 'auto',
            }}
            headerLabel={
                <ModalHeader
                    onClose={close}
                    children={'요청 미리보기'}
                />
            }
        >
            <b>URL</b>
            <div style={{ height:'0.15em' }}/>
            <Well>
                <small>
                    {previewData.url}
                </small>
            </Well>
            <div style={{ height:'0.5em' }}/>

            <b>Header</b>
            <div style={{ height:'0.15em' }}/>
            <Well
                style={{
                    overflowY: 'auto',
                }}
            >
                <small style={{ whiteSpace: 'pre' }}>{headersJSON}</small>
            </Well>
            <div style={{ height:'0.5em' }}/>

            <b>Body</b>
            <div style={{ height:'0.15em' }}/>
            <Well>
                <small style={{ whiteSpace: 'pre' }}>{bodyJSON}</small>
            </Well>
        </Modal>
    )
}

export default RequestPreviewModal;