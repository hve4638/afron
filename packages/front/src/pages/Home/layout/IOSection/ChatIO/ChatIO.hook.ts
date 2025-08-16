import { useEffect, useMemo, useRef, useState } from 'react';
import { useConfigStore, useSessionStore } from '@/stores';
import { useHistoryStore } from '@/stores/useHistoryStore';
import { HistoryData } from '@/features/session-history';
import { useEvent } from '@/hooks/useEvent';
import useCache from '@/hooks/useCache';
import { Ping, useBus } from '@/lib/zustbus';

interface useChatIOProps {
    refreshTrigger: () => void;
}

interface ChatIOEvent {
    load_more_history: Ping;
}
function useChatIO({ refreshTrigger }: useChatIOProps) {
    const [_, emitChatIO, useChatIOOn] = useBus<ChatIOEvent>();
    const { font_size } = useConfigStore();
    const lastSessionId = useSessionStore(state => state.deps.last_session_id);

    const [limit, setLimit] = useState(32);
    const [hasMore, setHasMore] = useState(true);
    const scrollAnchorRef = useRef<HTMLDivElement>(null);

    const historyData = useCache<{ current: HistoryData[] }>(() => ({ current: [] }), [lastSessionId]);
    const sessionHistoryManager = useMemo(() => {
        const historyState = useHistoryStore.getState();

        if (lastSessionId) {
            return historyState.get(lastSessionId);
        }
        else {
            return null;
        }
    }, [lastSessionId]);

    useChatIOOn('load_more_history', async () => {
        if (!hasMore) return;

        await loadHistory();
        setLimit(limit * 2);
    });

    const loadHistory = async () => {
        if (!sessionHistoryManager) {
            setHasMore(false);
            return;
        }

        const prev = await sessionHistoryManager.select(0, limit, true);
        if (prev.length < limit) {
            setHasMore(false);
        }

        historyData.current = prev;
        refreshTrigger();
    }

    // 세션 변경시 스크롤 최하단으로 이동
    useEffect(() => {
        setHasMore(true);
        window.setTimeout(
            () => {
                scrollAnchorRef.current?.scrollIntoView();
            }, 1,
        )
    }, [lastSessionId, scrollAnchorRef.current]);

    useEvent('refresh_chat', async () => {
        if (!sessionHistoryManager) return;

        await loadHistory();
        window.setTimeout(
            () => scrollAnchorRef.current?.scrollIntoView(), 1
        );
    }, [lastSessionId, sessionHistoryManager]);
    useEvent('refresh_chat_without_scroll', async () => {
        if (!sessionHistoryManager) return;

        await loadHistory();
    }, [lastSessionId, sessionHistoryManager]);

    const chats = useMemo(() => {
        return historyData.current.flatMap((item) => {
            const chat: { side: 'input' | 'output', value: string, key: string, data: HistoryData }[] = [];
            if (item.output) {
                chat.push({ side: 'output', value: item.output, key: `${item.id}_output`, data: item });
            }
            if (item.input) {
                chat.push({ side: 'input', value: item.input, key: `${item.id}_input`, data: item });
            }
            return chat;
        }).reverse();
    }, [historyData.current]);

    return {
        ref: {
            scrollAnchorRef,
        },
        state: {
            fontSize: font_size,
            chats,
            hasMore,
        },
        emit: emitChatIO,
    }
}

export default useChatIO;