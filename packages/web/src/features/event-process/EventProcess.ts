import { LevelLogger, NoLogger } from '@afron/core';
import { WebSocketManager } from '@/websocket';

import RTExportProcess from './RTExportProcess';
import RTImportProcess from './RTImportProcess';

class EventProcess {
    #rtExportProcessCached?: RTExportProcess;
    #rtImportProcessCached?: RTImportProcess;
    protected logger: LevelLogger;

    constructor(logger?: LevelLogger) {
        this.logger = logger ?? NoLogger.instance;
    }

    RTExportProcess(): RTExportProcess {
        this.#rtExportProcessCached ??= new RTExportProcess(
            (event) => {
                WebSocketManager.getInstance().broadcast({
                    channel: 'global',
                    chId: event.id,
                    data: event,
                });
            },
            this.logger
        );

        return this.#rtExportProcessCached;
    }

    RTImportProcess(): RTImportProcess {
        this.#rtImportProcessCached ??= new RTImportProcess(
            (event) => {
                WebSocketManager.getInstance().broadcast({
                    channel: 'global',
                    chId: event.id,
                    data: event,
                });
            },
            this.logger
        );

        return this.#rtImportProcessCached;
    }
}

export default EventProcess;
