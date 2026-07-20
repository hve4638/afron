import { createBus } from '@/lib/zustbus';

interface ProgressModalEvent {
    title: { id: string; value: string | null; };
    description: { id: string; value: string | null; };
    close: { id: string; };
    show_close_button: { id: string; };
}

export const progressModalBus = createBus<ProgressModalEvent>();
