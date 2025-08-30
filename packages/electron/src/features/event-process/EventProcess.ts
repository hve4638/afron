import type { BrowserWindow } from 'electron';
import { IPCListenerPing } from '@/data';
import { LevelLogger, NoLogger } from '@afron/core';

import RTExportProcess from './RTExportProcess';
import RTImportProcess from './RTImportProcess';

class EventProcess {
    #win?: WeakRef<BrowserWindow>;
    #rtExportProcessCached?: RTExportProcess;
    #rtImportProcessCached?: RTImportProcess;
    protected logger: LevelLogger;

    constructor(logger?: LevelLogger) {
        this.logger = logger ?? NoLogger.instance;
    }

    resetBrowserWindow(win: BrowserWindow) {
        this.#win = new WeakRef(win);
            
        this.#rtExportProcessCached = undefined;
        this.#rtImportProcessCached = undefined;
    }

    RTExportProcess(): RTExportProcess {
        this.#rtExportProcessCached ??= new RTExportProcess(
            (event) => {
                const win = this.window;
                if (win) {
                    win.webContents.send(IPCListenerPing.Global, event.id, event);
                }
            },
            this.logger
        );

        return this.#rtExportProcessCached;
    }

    RTImportProcess(): RTImportProcess {
        this.#rtImportProcessCached ??= new RTImportProcess(
            (event) => {
                const win = this.window;
                if (win) {
                    win.webContents.send(IPCListenerPing.Global, event.id, event);
                }
            },
            this.logger
        );

        return this.#rtImportProcessCached;
    }

    get window() {
        return this.#win?.deref();
    }
}

export default EventProcess;