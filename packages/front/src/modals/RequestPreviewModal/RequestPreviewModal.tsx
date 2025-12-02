import { Modal} from '@/components/modal';
import Well from '@/components/atoms/Well';
import useRequestPreviewModal from './RequestPreviewModal.hook';
import { HeaderLine, HeaderLineWithJSON } from './headers';
import { RTEventPreviewData } from '@afron/types';

type RequestPreviewModalProps = {
    previewData: RTEventPreviewData;
}

function RequestPreviewModal({
    previewData,
}: RequestPreviewModalProps) {
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
            style={{
                maxHeight: '95%',
                overflowY: 'auto',
            }}
            header={{
                label: '요청 미리보기',
                showCloseButton: true,
            }}
            allowEscapeKey={true}
        >
            <HeaderLine
                label='URL'
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