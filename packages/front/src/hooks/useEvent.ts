/**
 * 이벤트 구독 및 발행 훅
 */
import Latch from '@/lib/Latch';
import { LogEntry } from '@/stores/useErrorLogStore';
import { Toast } from '@/types/toast';
import { RTEventPreviewData } from '@afron/types';
import Channel from '@hve/channel';
import { useEffect } from 'react';
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

type ping = undefined;

/**
 * 이벤트 목록
 * 
 * 필요시 이곳에 이벤트 추가
 */
type Events = {
    font_size_up: ping;
    font_size_down: ping;
    send_request: ping;
    send_preview_request: ping;
    copy_response: ping;
    create_tab: ping;
    remove_tab: ping;
    undo_remove_tab: ping;
    next_tab: ping;
    prev_tab: ping;
    change_tab1: ping;
    change_tab2: ping;
    change_tab3: ping;
    change_tab4: ping;
    change_tab5: ping;
    change_tab6: ping;
    change_tab7: ping;
    change_tab8: ping;
    change_tab9: ping;

    /* 이벤트 처리 이후 */
    after_copy_response: ping; // 응답 복사 이후

    /* 제어 관련 */
    refresh_input: ping; // 입력 새로고침, backend에서 변경 후 refetch 필요시
    refresh_chat: ping; // 채팅 새로고침
    refresh_chat_without_scroll: ping;
    
    /*  */
    update_input_token_count: ping;

    /* 리랜더링 관련 */
    refresh_session_metadata: ping; // 세션 탭 메타데이터 새로고침
    refresh_rt_tree: ping;

    /* UI 이벤트 */
    change_profile: ping;
    input_file_upload: { file: File, latch: Latch };
5
    logging_error: LogEntry;
    show_toast_message: Toast;

    /* 모달 열기 */
    open_rt_preview_modal: RTEventPreviewData;
    open_error_log: string | null;
    open_progress_modal: { modalId: string; description?: string; progress?: number; };
    open_new_rt_modal: ping;

    /* Chaining */
    request_ready: Latch;

    import_rt_from_file: ping;
    export_rt_to_file: { rtId: string; };

    goto_rt_editor: { rtId: string; }
}

export type EventNames = keyof Events;

type EventFields = {
    [K in EventNames]: {
        current: Events[K]
    };
}

const useEventStore = create<EventFields, [['zustand/subscribeWithSelector', never]]>(
    subscribeWithSelector((set) => {
        // 초기값은 어짜피 접근할 수 없으므로 빈 객체로 설정
        // 하나하나 지정한다면 복잡성이 증가해서 유연성이 떨어짐
        return {} as EventFields;
    })
);

/**
 * 이벤트 구독 훅
 * 
 * @param key
 * @param callback 
 * @param deps
 * @param enabled
 */
export function useEvent<T extends EventNames>(
    key: T,
    callback: (value: Events[T]) => void,
    deps: React.DependencyList = [],
    enabled: boolean = true
) {
    useEffect(() => {
        if (!enabled) return;

        const unsub = useEventStore.subscribe(
            (data) => data[key],
            (value) => callback(value?.current),
        );

        return () => unsub();
    }, [...deps, enabled]);
}

export function emitEvent<T extends EventNames>(
    key: T,
    ...values: (
        Events[T] extends undefined
        ? []
        : [Events[T]]
    )
) {
    useEventStore.setState((prev) => ({
        ...prev,
        [key]: { current: values[0] },
    }));
}

export function useEventState<T extends EventNames>(key: T) {
    return useEventStore((state) => state[key]);
}