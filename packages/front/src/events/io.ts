import Latch from '@/lib/Latch';
import { createBus, Ping } from '@/lib/zustbus';

interface IOEvent {
    input_file_upload: { file: File, latch: Latch };
    update_input_token_count: Ping;
}

export const ioBus = createBus<IOEvent>();
