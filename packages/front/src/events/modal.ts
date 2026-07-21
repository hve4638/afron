import { createBus, Ping } from '@/lib/zustbus';
import { RTEventPreviewData } from '@afron/types';

interface ModalEvent {
    open_rt_preview_modal: RTEventPreviewData;
    open_error_log: string | null;
    open_progress_modal: { modalId: string; description?: string; progress?: number; };
    open_new_rt_modal: Ping;
}

export const modalBus = createBus<ModalEvent>();
