/**
 * 이벤트 구독 및 발행 훅
 */
import { useEffect } from 'react';
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

/**
 * 이벤트 목록
 * 
 * 필요시 이곳에 이벤트 추가
 */
type Events = {
    /* 단축키 이벤트 */
    font_size_up: number;
    font_size_down: number;
    send_request: number;
    copy_response: number;
    create_tab: number;
    remove_tab: number;
    undo_remove_tab: number;
    next_tab: number;
    prev_tab: number;
    change_tab1: number;
    change_tab2: number;
    change_tab3: number;
    change_tab4: number;
    change_tab5: number;
    change_tab6: number;
    change_tab7: number;
    change_tab8: number;
    change_tab9: number;

    /* 제어 관련 */
    refresh_input: number; // 입력 새로고침, backend에서 변경 후 refetch 필요시
    refresh_chat: number; // 채팅 새로고침
    refresh_chat_without_scroll: number;

    /* 리랜더링 관련 */
    refresh_session_metadata: number; // 세션 탭 메타데이터 새로고침
    refresh_rt_tree: number;

    /* UI 이벤트 */
    change_profile: number;

    request: number;
}

export type EventNames = keyof Events;

const useEventStore = create<Events, [['zustand/subscribeWithSelector', never]]>(
    subscribeWithSelector((set) => {
        return {} as Events; // Initialize with an empty object
    })
);

export const useEvent = <T extends keyof Events>(key: T, callback: () => void, deps?: React.DependencyList) => {
    useEffect(() => {
        const unsub = useEventStore.subscribe(
            (data) => data[key],
            () => callback(),
        );

        return () => unsub();
    }, deps);
}

export const emitEvent = (key: EventNames) => {
    useEventStore.setState((prev) => ({
        ...prev,
        [key]: (prev[key] ?? 0) + 1,
    }));
}