export type EventMap = object;
export type Ping = undefined;

export type Field<T> = { current: T };
export type StoreShape<E extends EventMap> = { [K in keyof E]?: Field<E[K]> };

export type UseValue<TField extends EventMap> = <TKey extends keyof TField>(
    key: TKey,
) => TField[TKey] | undefined;
export type Emit<TField extends EventMap> = <TKey extends keyof TField>(
    key: TKey,
    ...values: undefined extends TField[TKey] ? [] : [TField[TKey]]
) => void;
export type UseOn<TField extends EventMap> = <TKey extends keyof TField>(
    key: TKey,
    callback: (value: TField[TKey]) => void,
    deps?: React.DependencyList,
    enabled?: boolean
) => void;