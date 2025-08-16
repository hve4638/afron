import { useEffect, useRef } from 'react';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import { Emit, EventMap, StoreShape, UseOn, UseValue } from './types';

function useLatestRef<T>(value: T) {
    const ref = useRef(value);
    ref.current = value;
    return ref;
}

/** @returns [useValue, emit, useOn] */
export function createBus<E extends EventMap>(): [UseValue<E>, Emit<E>, UseOn<E>] {
    const useStore = create<StoreShape<E>, [['zustand/subscribeWithSelector', never]]>(
        subscribeWithSelector(() => ({} as StoreShape<E>))
    );
    
    function useOn<K extends keyof E>(
        key: K,
        callback: (value: E[K]) => void,
        deps: React.DependencyList = [],
        enabled: boolean = true
    ) {
        const cbRef = useLatestRef(callback);

        useEffect(() => {
            if (!enabled) return;
            const unsub = useStore.subscribe(
                (s) => s[key],
                (v) => { if (v) cbRef.current(v.current as E[K]); }
            );
            return () => unsub();
        }, [enabled, ...deps]);
    }

    function emit<K extends keyof E>(
        key: K,
        ...values: undefined extends E[K] ? [] : [E[K]]
    ) {
        useStore.setState((prev) => ({ ...prev, [key]: { current: values[0] as E[K] } }));
    }

    function useValue<K extends keyof E>(key: K) {
        return useStore((s) => s[key]?.current);
    }

    return [useValue, emit, useOn] as const;
}

export type ping = undefined;
