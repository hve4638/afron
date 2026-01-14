type RunningRt = Record<string, { state?: string }>;

const STATE_ORDER = {
    idle: 0,
    done: 0,
    loading: 1,
    error: 2,
} as const;

export type SessionStateType = keyof typeof STATE_ORDER;

export function deriveSessionState(runningRt?: RunningRt): SessionStateType {
    let currentState: SessionStateType = 'idle';
    let currentOrder: number = STATE_ORDER.idle;

    for (const rt of Object.values(runningRt ?? {})) {
        const state = rt.state as SessionStateType | undefined;
        const order = state == null ? undefined : STATE_ORDER[state];
        if (order == null || state == null) continue;
        if (order > currentOrder) {
            currentOrder = order;
            currentState = state;
        }
    }

    return currentState;
}
