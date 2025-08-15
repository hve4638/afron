import { emitEvent, EventNames, useEvent } from '@/hooks/useEvent';
import { useCacheStore, useProfileAPIStore, useSessionStore } from '@/stores';
import RequestManager from '@/features/request-manager';
import Channel from '@hve/channel';
import { useCallback } from 'react';
function useEventHandler() {
    const api = useProfileAPIStore(state => state.api);
    const last_session_id = useCacheStore(state => state.last_session_id);
    const checkAPI = useCallback(() => {
        if (api.isMock()) {
            console.warn('API is not initialized. Request is ignored.');
            return false;
        }
        return true;
    }, [api]);

    useEvent('send_preview_request', async () => {
        if (!checkAPI()) return;
        if (last_session_id == null) return;

        const waitChannel = new Channel();
        emitEvent('request_ready', waitChannel);
        await waitChannel.consume();

        RequestManager.preview(api.id, last_session_id);
    }, [last_session_id, api]);

    useEvent('send_request', async () => {
        if (!checkAPI()) return;
        if (last_session_id == null) return;

        const waitChannel = new Channel();
        emitEvent('request_ready', waitChannel);
        await waitChannel.consume();

        RequestManager.request(api.id, last_session_id);
    }, [last_session_id, api]);

    useEvent('copy_response', () => {
        const { output } = useSessionStore.getState();
        if (output) {
            try {
                navigator.clipboard.writeText(output);
                emitEvent('after_copy_response');
            }
            catch (error) {
                console.error('Failed to copy response:', error);
            }
        }
    }, []);
}

export default useEventHandler;