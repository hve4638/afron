import Button from '@/components/atoms/Button';
import { GIconButton } from '@/components/atoms/GoogleFontIcon';
import { Align, Flex, Row } from '@/components/layout';
import { Modal, ModalHeader } from '@/components/modal';
import CopyIconButton from '@/components/ui/CopyIconButton';
import Well from '@/components/atoms/Well';
import useHotkey from '@/hooks/useHotkey';
import useModalDisappear from '@/hooks/useModalDisappear';
import { useMemo } from 'react';
import useRequestPreviewModal from './RequestPreviewModal.hook';
import { HeaderLine, HeaderLineWithJSON } from './headers';
import { RTEventPreviewData } from '@afron/types';

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

    useHotkey({
        'Escape': close,
    }, isFocused, []);

    const {
        previewText,
        state
    } = useRequestPreviewModal({ previewData });

    const [headerPrettify, setHeaderPrettify] = state.preview_prettify_header;
    const [bodyPrettify, setBodyPrettify] = state.preview_prettify_body;

    const jsonToComponent = (json: string) => {
        return json
            .split('\n')
            .map((line, i) => <div key={i}>{line}</div>)
    }

    return (
        <Modal
            disappear={disappear}
            // onClose={close}
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
            <HeaderLine
                label="URL"
                content={previewData.url}
            />
            <Well>
                <small>
                    {previewText.url}
                </small>
            </Well>
            <div style={{ height: '0.5em' }} />

            <HeaderLineWithJSON
                label='Header'
                content={previewText.headers}
                jsonPrettifyValue={headerPrettify}
                onClickJSONPrettify={setHeaderPrettify}
            />
            <div style={{ height: '0.15em' }} />
            <Well
                style={{
                    overflowY: 'auto',
                    overflowX: 'auto',
                }}
            >
                <small
                    style={{
                        whiteSpace: headerPrettify ? 'pre' : 'pre-line',
                    }}>{jsonToComponent(previewText.headers)}</small>
            </Well>
            <div style={{ height: '0.5em' }} />

            <HeaderLineWithJSON
                label='Body'
                content={previewText.body}
                jsonPrettifyValue={bodyPrettify}
                onClickJSONPrettify={setBodyPrettify}
            />
            <div style={{ height: '0.15em' }} />
            <Well
                style={{
                    overflowY: 'auto',
                    overflowX: 'auto',
                }}
            >
                <small style={{
                    whiteSpace: bodyPrettify ? 'pre' : 'pre-line',
                }}>{jsonToComponent(previewText.body)}</small>
            </Well>
        </Modal>
    )
}

export default RequestPreviewModal;