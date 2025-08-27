import { useEvent } from '@/hooks/useEvent';
import { useModal } from '@/hooks/useModal';
import ErrorLogModal from '@/modals/ErrorLogModal';
import ProgressModal from '@/modals/ProgressModal';
import RequestPreviewModal from '@/modals/RequestPreviewModal';

function ModalHandler() {
    const modal = useModal();
    useEvent('open_rt_preview_modal', (previewData) => {
        modal.open(RequestPreviewModal, {
            previewData: previewData,
        })
    }, []);

    useEvent('open_error_log', (errorId: string | null) => {
        modal.open(ErrorLogModal, {
            errorId: errorId,
        });
    });

    useEvent('open_progress_modal', (data: { modalId: string; description?: string; progress?: number; }) => {
        modal.open(ProgressModal, {
            modalId: data.modalId,
            description: data.description,
            progress: data.progress,
        });
    });

    return <></>
}

export default ModalHandler;