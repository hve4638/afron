import { FastStore } from '@/features/fast-store';
import ThrottleAction from '@/features/throttle-action';
import runtime from '@/runtime';
import { IPCInvokers, KeyValueInput } from '@afron/types';

export function globalConfig(): IPCInvokers.GlobalConfig {
    const store = FastStore.instance();
    const throttle = ThrottleAction.getInstance();

    return {
        async getHardwareAccelerationEnabled() {
            store.load();
            const value = store.get('hardware_acceleration_enabled');

            return [null, value ?? false];
        },
        async setHardwareAccelerationEnabled(value: boolean) {
            store.load();
            store.set('hardware_acceleration_enabled', value);
            store.save();

            return [null];
        }
    }
}