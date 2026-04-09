import { IPCInvokers } from '@afron/types';

/**
 * 하드웨어 가속은 Electron 전용 기능.
 * web에서는 stub으로 처리.
 */
export function globalConfig(): IPCInvokers.GlobalConfig {
    return {
        async getHardwareAccelerationEnabled() {
            return [null, false];
        },
        async setHardwareAccelerationEnabled(_value: boolean) {
            return [null];
        }
    }
}
