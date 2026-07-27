import { useEffect, useState } from 'react';
import { useLatestRef } from '@/hooks/useLatestRef';

import { EventMap, OnHandle } from './types';

/**
 * 버스 이벤트 구독
 *
 * @param handle 구독 핸들 (`bus.on.<key>`)
 * @param callback 이벤트 수신 콜백 (최신 클로저 자동 참조)
 * @param deps 콜백 재구독 조건 (기본값 `[]`)
 * @param enabled false면 구독 해제 (기본값 `true`)
 */
export function useOn<E extends EventMap, K extends keyof E>(
    handle: OnHandle<E, K>,
    callback: (value: E[K]) => void,
    deps: React.DependencyList = [],
    enabled: boolean = true,
) {
    const cbRef = useLatestRef(callback);

    useEffect(() => {
        if (!enabled) return;
        return handle.store.subscribe(
            (s) => s[handle.key],
            (v) => {
                if (!v) return;
                // 구독자 하나의 throw가 후속 리스너와 emit 호출부를 깨지 않도록 격리
                try {
                    cbRef.current(v.current as E[K]);
                }
                catch (e) {
                    console.error(`[zustbus] listener error on '${String(handle.key)}':`, e);
                }
            },
        );
    }, [enabled, handle.store, handle.key, ...deps]);
}

/**
 * 이벤트 발행 횟수를 단조 증가 숫자로 반환 (useEffect deps용 ping-as-dep 관용구 대체)
 *
 * @returns 해당 이벤트가 emit될 때마다 1씩 증가하는 숫자
 */
export function useEventVersion<E extends EventMap, K extends keyof E>(handle: OnHandle<E, K>): number {
    const [version, setVersion] = useState(0);
    useOn(handle, () => setVersion((v) => v + 1));
    return version;
}
