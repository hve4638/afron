import BaseEventEmitter from './BaseEventEmitter';

class GlobalEventEmitter extends BaseEventEmitter<GlobalEventData, GlobalEventDataWithoutId> {
    readonly emit = {
        rtExport: {
            ready: () => {
                this.logger.debug(`GlobalEventEmitter rt_export.ready (${this.token})`);
                this.sendForce({
                    type: 'rt_export',
                    state: 'ready',
                });
            },
            progress: (percent: number, description: string) => {
                this.logger.debug(`GlobalEventEmitter rt_export.progress (${this.token})`);
                this.sendForce({
                    type: 'rt_export',
                    state: 'progress',
                    percent,
                    description,
                });
            },
            done: () => {
                this.logger.debug(`GlobalEventEmitter rt_export.done (${this.token})`);
                this.sendForce({
                    type: 'rt_export',
                    state: 'done',
                });
            },
            cancel: () => {
                this.logger.debug(`GlobalEventEmitter rt_export.cancel (${this.token})`);
                this.sendForce({
                    type: 'rt_export',
                    state: 'cancel',
                });
            },
        },
        rtImport: {
            ready: () => {
                this.logger.debug(`GlobalEventEmitter rt_import.ready (${this.token})`);
                this.sendForce({
                    type: 'rt_import',
                    state: 'ready',
                });
            },
            failed: () => {
                this.logger.debug(`GlobalEventEmitter rt_import.failed (${this.token})`);
                this.sendForce({
                    type: 'rt_import',
                    state: 'failed',
                });
            },
            done: () => {
                this.logger.debug(`GlobalEventEmitter rt_import.done (${this.token})`);
                this.sendForce({
                    type: 'rt_import',
                    state: 'done',
                });
            },
            cancel: () => {
                this.logger.debug(`GlobalEventEmitter rt_import.cancel (${this.token})`);
                this.sendForce({
                    type: 'rt_import',
                    state: 'cancel',
                });
            },
        },
        close: () => {
            this.logger.debug(`GlobalEventEmitter.close (${this.token})`);
            this.sendForce({
                type: 'close',
            });
        }
    } as const;
}

export default GlobalEventEmitter;