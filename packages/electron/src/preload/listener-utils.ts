import { ipcRenderer } from 'electron';

export function createListenerManager() {
    let nextId = 0;
    const listeners = new Map<number, { channel: string; listener: Function }>();

    return {
        add(channel: string, listener: Function): readonly [null, number] {
            const id = nextId++;
            listeners.set(id, { channel, listener });
            ipcRenderer.on(channel, listener as any);
            return [null, id] as const;
        },

        remove(id: number): readonly [null] {
            const entry = listeners.get(id);
            if (entry) {
                ipcRenderer.off(entry.channel, entry.listener as any);
                listeners.delete(id);
            }
            return [null] as const;
        },

        getCount(): number {
            return listeners.size;
        }
    };
}