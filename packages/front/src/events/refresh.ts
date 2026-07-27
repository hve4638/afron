import { createBus, Ping } from '@/lib/zustbus';

interface RefreshEvent {
    refresh_input: Ping;
    refresh_chat: Ping;
    refresh_chat_without_scroll: Ping;
    refresh_session_metadata: Ping;
    refresh_rt_tree: Ping;
}

export const refreshBus = createBus<RefreshEvent>();
