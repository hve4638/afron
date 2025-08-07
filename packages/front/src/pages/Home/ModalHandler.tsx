import { useEvent } from '@/hooks/useEvent';
import { useModal } from '@/hooks/useModal';
import RequestPreviewModal from '@/modals/RequestPreviewModal';

function ModalHandler() {
    const modal = useModal();
    useEvent('show_rt_preview', (previewData) => {
        modal.open(RequestPreviewModal, {
            previewData: previewData,
        })
    }, [])

    return <></>
}

export default ModalHandler;