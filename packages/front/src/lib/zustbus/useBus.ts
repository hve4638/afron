import { useCallback, useEffect, useRef } from 'react';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useLatestRef } from '@/hooks/useLatestRef';
import { Emit, EventMap, StoreShape, UseEvent, UseValue, } from './types';

function createLocal<E extends EventMap>() {
    return create<StoreShape<E>, [['zustand/subscribeWithSelector', never]]>(
        subscribeWithSelector(() => ({} as StoreShape<E>))
    );
}

/** @returns [useValue, emit, useOn] */
export function useBus<E extends EventMap>(): [UseValue<E>, Emit<E>, UseEvent<E>] {
    const storeRef = useRef<ReturnType<typeof createLocal<E>>>();
    if (!storeRef.current) storeRef.current = createLocal<E>();
    const useStore = storeRef.current;

    function use<K extends keyof E>(
        key: K,
        callback: (value: E[K]) => void,
        deps: React.DependencyList = [],
        enabled: boolean = true
    ) {
        const cbRef = useLatestRef(callback);

        useEffect(() => {
            if (!enabled) return;
            const unsub = useStore.subscribe(
                (data) => data[key],
                (value) => {
                    if (value) cbRef.current(value.current as E[K]);
                }
            );
            return () => unsub();
        }, [enabled, ...deps]);
    }

    function emit<K extends keyof E>(
        key: K,
        ...values: undefined extends E[K] ? [] : [E[K]]
    ) {
        useStore.setState((prev) => ({
            ...prev,
            [key]: { current: values[0] as E[K] },
        }));
    }

    function useValue<K extends keyof E>(key: K) {
        return useStore(state => state[key]?.current);
    }

    const useValueCallback = useCallback(useValue, [useStore]);
    const emitCallback = useCallback(emit, [useStore]);
    const useOnCallback = useCallback(use, [useStore]);

    return [useValueCallback, emitCallback, useOnCallback] as const;
}
