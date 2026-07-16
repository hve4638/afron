import { Mutate, StoreApi, UseBoundStore } from 'zustand';

export type EventMap = object;
export type Ping = undefined;

export type Field<T> = { current: T };
export type StoreShape<E extends EventMap> = { [K in keyof E]?: Field<E[K]> };

/** 이벤트 키별 발행 함수 집합. `emit.save(payload)` / `emit.close()` 형태로 사용 */
export type EmitObj<E extends EventMap> = {
    [K in keyof E]: (...args: undefined extends E[K] ? [] : [E[K]]) => void;
};

export type BusStore<E extends EventMap> = UseBoundStore<
    Mutate<StoreApi<StoreShape<E>>, [['zustand/subscribeWithSelector', never]]>
>;

/** 버스 핸들. 구독은 모듈 export 훅 `useOn(bus, key, cb)`로 수행 */
export interface Bus<E extends EventMap> {
    emit: EmitObj<E>;
    store: BusStore<E>;
}
