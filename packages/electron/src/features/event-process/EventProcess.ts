import type { BrowserWindow } from 'electron';
import { IPCListenerPing } from '@/data';
import { LevelLogger, NoLogger } from '@afron/core';

import RTExportProcess from './RTExportProcess';

class EventProcess {
    #win?: WeakRef<BrowserWindow>;
    #rtExportProcessCached?: RTExportProcess;
    protected logger: LevelLogger;

    constructor(logger?: LevelLogger) {
        this.logger = logger ?? NoLogger.instance;
    }

    resetBrowserWindow(win: BrowserWindow) {
        this.#win = new WeakRef(win);
            
        this.#rtExportProcessCached = undefined;
    }

    RTExportProcess(): RTExportProcess {
        this.#rtExportProcessCached ??= new RTExportProcess(
            (event) => {
                const win = this.window;
                if (win) {
                    win.webContents.send(IPCListenerPing.Global, event.id, event);
                }
            }
        );

        return this.#rtExportProcessCached;
    }

    get window() {
        return this.#win?.deref();
    }
}

export default EventProcess;