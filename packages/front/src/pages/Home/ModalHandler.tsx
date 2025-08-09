import { useEvent } from '@/hooks/useEvent';
import { useModal } from '@/hooks/useModal';
import ErrorLogModal from '@/modals/ErrorLogModal';
import RequestPreviewModal from '@/modals/RequestPreviewModal';

function ModalHandler() {
    const modal = useModal();
    useEvent('show_rt_preview', (previewData) => {
        modal.open(RequestPreviewModal, {
            previewData: previewData,
        })
    }, []);

    useEvent('open_error_log', (errorId: string | null) => {
        modal.open(ErrorLogModal, {
            errorId: errorId,
        });
    });

    return <></>
}

export default ModalHandler;