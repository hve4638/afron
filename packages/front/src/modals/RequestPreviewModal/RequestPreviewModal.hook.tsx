import useConfigStore from '@/stores/useConfigStore';
import { RTEventPreviewData } from '@afron/types';
import { useMemo } from 'react';

type useRequestPreviewModalProps = {
    previewData: RTEventPreviewData;
}

function useRequestPreviewModal({
    previewData,
}: useRequestPreviewModalProps) {
    const headerPrettify = useConfigStore(state => state.preview_prettify_header);
    const setHeaderPrettify = useConfigStore(state => state.update.preview_prettify_header);

    const bodyPrettify = useConfigStore(state => state.preview_prettify_body);
    const setBodyPrettify = useConfigStore(state => state.update.preview_prettify_body);

    const headersJSON = useMemo(() => {
        return (
            headerPrettify
                ? JSON.stringify(previewData.headers, null, 4)
                : JSON.stringify(previewData.headers)
        )
    }, [previewData.headers, headerPrettify]);
    const bodyJSON = useMemo(() => {
        return (
            bodyPrettify
                ? JSON.stringify(previewData.data, null, 4)
                : JSON.stringify(previewData.data)
        )
    }, [previewData.data, bodyPrettify]);

    return {
        state: {
            preview_prettify_header: [headerPrettify, setHeaderPrettify] as const,
            preview_prettify_body: [bodyPrettify, setBodyPrettify] as const,
        },
        previewText: {
            url: previewData.url,
            headers: headersJSON,
            body: bodyJSON,
        },
    }
}

export default useRequestPreviewModal;