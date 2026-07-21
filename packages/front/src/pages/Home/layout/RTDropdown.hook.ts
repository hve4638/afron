import { useEffect, useState } from 'react';

import { useSessionStore } from '@/stores';
import ProfileEvent from '@/features/profile-event';

import { refreshBus } from '@/events/refresh';
import { useEventVersion } from '@/lib/zustbus';
import { RTMetadataTree } from '@afron/types';

function useRTDropdown() {
    const refreshPing = useEventVersion(refreshBus.on.refresh_rt_tree);

    const rtId = useSessionStore(state => state.rt_id);
    const name = useSessionStore(state => state.name);
    const updateSessionState = useSessionStore(state => state.update);

    const [tree, setTree] = useState<RTMetadataTree>([]);

    useEffect(() => {
        ProfileEvent.rt.getTree()
            .then((tree) => {
                setTree(tree);
            });
    }, [refreshPing]);

    const changeRT = async (rtId: string) => {
        await updateSessionState.rt_id(rtId);

        // 세션 이름이 지정되지 않았다면, 대신 RT 이름을 표시하므로 갱신을 위해 event 발생
        if (name == null || name === '') {
            refreshBus.emit.refresh_session_metadata();
        }
    }

    return {
        state: {
            tree,
            rtId,
        },
        action: {
            changeRT,
        }
    }
}

export default useRTDropdown;