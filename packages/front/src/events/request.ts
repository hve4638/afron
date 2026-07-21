import Latch from '@/lib/Latch';
import { createBus, Ping } from '@/lib/zustbus';

interface RequestEvent {
    send_request: Ping;
    send_preview_request: Ping;
    abort_request: Ping;
    copy_response: Ping;
    after_copy_response: Ping;

    request_ready: Latch;
}

export const requestBus = createBus<RequestEvent>();
