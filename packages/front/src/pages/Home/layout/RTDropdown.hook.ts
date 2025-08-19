import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { useSessionStore } from '@/stores';
import ProfileEvent from '@/features/profile-event';

import { emitEvent, useEventState } from '@/hooks/useEvent';
import { useModal } from '@/hooks/useModal';

import NewRTModal from '@/modals/NewRTModal';

function useRTDropdown() {
    const navigate = useNavigate();
    const refreshPing = useEventState('refresh_rt_tree');

    const modal = useModal();

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

    const openNewRTModal = () => {
        modal.open(NewRTModal, {
            onAddRT: (rtId: string, mode: RTMode) => {
                navigate(`/workflow/${rtId}/prompt/default`);
            }
        });
    }

    const changeRT = async (rtId: string) => {
        await updateSessionState.rt_id(rtId);

        // 세션 이름이 지정되지 않았다면, 대신 RT 이름을 표시하므로 갱신을 위해 event 발생
        if (name == null || name === '') {
            emitEvent('refresh_session_metadata');
        }
    }

    return {
        state: {
            tree,
            rtId,
        },
        action: {
            openNewRTModal,
            changeRT,
        }
    }
}

export default useRTDropdown;