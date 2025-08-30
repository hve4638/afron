export const IPCListenerPing = {
    Request: 'listener-request',
    Global: 'listener-global',
    Debug: 'listener-debug',
} as const;
export type IPCListenerPing = typeof IPCListenerPing[keyof typeof IPCListenerPing];