import BaseEventEmitter from './BaseEventEmitter';

class GlobalEventEmitter extends BaseEventEmitter<GlobalEventData, GlobalEventDataWithoutId> {
    readonly emit = {
        rtExport: {
            ready: () => {
                this.logger.debug(`GlobalEventEmitter export_rt_to_file.ready (${this.token})`);
                this.sendForce({
                    type: 'export_rt_to_file',
                    state: 'ready',
                });
            },
            progress: (percent: number, description: string) => {
                this.logger.debug(`GlobalEventEmitter export_rt_to_file.progress (${this.token})`);
                this.sendForce({
                    type: 'export_rt_to_file',
                    state: 'progress',
                    percent,
                    description,
                });
            },
            done: () => {
                this.logger.debug(`GlobalEventEmitter export_rt_to_file.done (${this.token})`);
                this.sendForce({
                    type: 'export_rt_to_file',
                    state: 'done',
                });
            },
            cancel: () => {
                this.logger.debug(`GlobalEventEmitter export_rt_to_file.cancel (${this.token})`);
                this.sendForce({
                    type: 'export_rt_to_file',
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