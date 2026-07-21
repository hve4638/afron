import { useNavigate } from 'react-router';

import { modalBus } from '@/events/modal';
import { navigateBus } from '@/events/navigate';
import { useOn } from '@/lib/zustbus';

import ErrorLogModal from '@/modals/ErrorLogModal';
import { NewRTModal } from '@/modals/NewRTModal';
import ProgressModal from '@/modals/ProgressModal';
import RequestPreviewModal from '@/modals/RequestPreviewModal';
import { useModal } from '@/features/modal';


function ModalHandler() {
    const modal = useModal();
    useOn(modalBus.on.open_rt_preview_modal, (previewData) => {
        modal.open(<RequestPreviewModal previewData={previewData} />)
    }, []);

    useOn(modalBus.on.open_error_log, (errorId: string | null) => {
        modal.open(<ErrorLogModal errorId={errorId} />);
    });

    useOn(modalBus.on.open_progress_modal, (data: { modalId: string; description?: string; progress?: number; }) => {
        modal.open(<ProgressModal modalId={data.modalId} description={data.description} progress={data.progress} />);
    });

    useOn(modalBus.on.open_new_rt_modal, () => {
        modal.open(
            <NewRTModal
                onAddRT={(rtId, rtMode) => navigateBus.emit.goto_rt_editor({ rtId })}
            />
        );
    }, []);

    return <></>;
}

export default ModalHandler;