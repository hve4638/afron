import { useEffect } from 'react';
import { v7 as uuidv7 } from 'uuid';

import LocalAPI from '@/api/local';
import { GlobalEventPipe, RequestEventPipe } from '@/api/events';

import { subscribeStates, useProfileAPIStore } from '@/stores';
import useMemoryStore from '@/stores/useMemoryStore';
import { emitEvent, useEvent } from '@/hooks/useEvent';
import { RTExportManager, RTImportManager } from '@/features/event-pipe-handler';



function useInitialize() {
    useEffect(() => {
        // Zustand State 의존성 관련 구독
        return subscribeStates();
    }, []);

    useEffect(() => {
        RequestEventPipe.register();
        GlobalEventPipe.register();

        return () => {
            RequestEventPipe.unregister();
            GlobalEventPipe.unregister();
        }
    }, []);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            LocalAPI.general.echo('[MESSAGE] UNHANDLE');
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    useEvent('change_profile', () => {
        useMemoryStore.setState({ profileId: null });
    }, []);

    useEvent('import_rt_from_file', () => {
        const { api } = useProfileAPIStore.getState();

        const modalId = uuidv7();
        emitEvent('open_progress_modal', { modalId });
        RTImportManager.importFile(api.id, { modalId });
    })

    useEvent('export_rt_to_file', ({ rtId }) => {
        const { api } = useProfileAPIStore.getState();

        const modalId = uuidv7();
        emitEvent('open_progress_modal', { modalId });
        RTExportManager.exportFile(api.id, rtId, { modalId });
    })
}

export default useInitialize;