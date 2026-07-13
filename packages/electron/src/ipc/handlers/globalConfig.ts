import { GlobalStore } from '@/features/global-store';
import ThrottleAction from '@/features/throttle-action';
import { IPCInvokers } from '@afron/types';

export function globalConfig(): IPCInvokers.GlobalConfig {
    const config = GlobalStore.config();

    return {
        async getHardwareAccelerationEnabled() {
            const value = config.get('hardware_acceleration_enabled');

            return [null, value ?? false];
        },
        async setHardwareAccelerationEnabled(value: boolean) {
            config.load();
            config.set('hardware_acceleration_enabled', value);
            // @TODO: throttle 추가 필요
            config.save();

            return [null];
        }
    }
}