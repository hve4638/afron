import { useEffect } from 'react';
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

type Events = {
    test_ping: number;

    // 이벤트 추가 예정
}

const useEventStore = create<Events, [['zustand/subscribeWithSelector', never]]>(
    subscribeWithSelector((set) => {
        return {} as Events; // 초기 상태는 undefined
    })
);

export const actionEvent = (key: keyof Events) => {
    useEventStore.setState((prev) => ({
        ...prev,
        [key]: (prev[key] ?? 0) + 1,
    }));
}

const useEvent = <T extends keyof Events>(key: T, callback: (next: Events[T], prev: Events[T]) => void, deps: React.DependencyList) => {
    useEffect(() => {
        const unsub = useEventStore.subscribe(
            (data) => data[key],
            (next, prev) => callback(next, prev),
        );
        
        return () => unsub();
    }, deps);
}

export default useEvent;