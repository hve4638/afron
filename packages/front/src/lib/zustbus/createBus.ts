import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import { Bus, EmitObj, EventMap, StoreShape } from './types';

/**
 * 전역 이벤트 버스 생성
 *
 * @returns `Bus<E>` 핸들. `bus.emit.<key>(payload)`로 발행하고, 구독은 `useOn(bus, key, cb)` 훅 사용
 */
export function createBus<E extends EventMap>(): Bus<E> {
    const useStore = create<StoreShape<E>, [['zustand/subscribeWithSelector', never]]>(
        subscribeWithSelector(() => ({} as StoreShape<E>))
    );

    // EventMap은 타입 정보뿐이라 런타임에 key 목록이 없으므로 emit은 Proxy로 구현.
    // per-key 함수 캐시로 emit.<key>의 참조를 고정해 prop으로 넘겨도 memo 자식이 리렌더되지 않게 함
    const cache = new Map<PropertyKey, (...args: unknown[]) => void>();
    const emit = new Proxy({} as EmitObj<E>, {
        get(_, key) {
            // 심볼·'then' 접근에 함수를 반환하면 await/console 등에서 thenable로 오작동하므로 차단
            if (typeof key === 'symbol' || key === 'then') return undefined;
            let fn = cache.get(key);
            if (!fn) {
                fn = (...args) => useStore.setState((prev) => ({ ...prev, [key]: { current: args[0] } } as StoreShape<E>));
                cache.set(key, fn);
            }
            return fn;
        },
    });

    return { emit, store: useStore };
}
