import { createBus, Ping } from '@/lib/zustbus';
import { Toast } from '@/types/toast';

interface AppEvent {
    font_size_up: Ping;
    font_size_down: Ping;
    change_profile: Ping;
    show_toast_message: Toast;
}

export const appBus = createBus<AppEvent>();
