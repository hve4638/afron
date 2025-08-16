import { useEffect, useState } from 'react'
import LocalAPI from '@/api/local';
import RequestAPI from '@/api/request';

import { subscribeStates } from '@/stores';
import useMemoryStore from '@/stores/useMemoryStore';
import { useEvent } from '@/hooks/useEvent';

function useInitialize() {
    useEffect(() => {
        // Zustand State 의존성 관련 구독
        return subscribeStates();
    }, []);

    useEffect(() => {
        RequestAPI.register()

        return () => {
            RequestAPI.unregister();
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
}

export default useInitialize;