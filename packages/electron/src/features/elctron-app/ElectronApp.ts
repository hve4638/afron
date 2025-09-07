import { app, BrowserWindow, Menu, globalShortcut } from 'electron';
import * as electronLocalshortcut from 'electron-localshortcut';
import { throttle } from '@/utils';
import runtime from '@/runtime';

import * as staticPath from '@/static-path';
import { IPCListenerPing } from '@/data';

const MINIMUM_WINDOW_SIZE = [640, 520];
const DEFAULT_WINDOW_SIZE = [1280, 900];

class ElectronApp {
    async run() {
        await app.whenReady();
        runtime.logger.info('Afron is starting...');

        const win = await this.#openNewWindow();

        this.#setupApplicationMenu();
        await this.#setupAppHandler(app);
        await this.#setupWindowHandler(win);
    }

    async #createBrowserWindow(): Promise<BrowserWindow> {
        const cacheAC = await runtime.globalStorage.accessAsJSON('cache.json');
        const [width, height] = cacheAC.getOne('lastsize') ?? DEFAULT_WINDOW_SIZE;
        const [minWidth, minHeight] = MINIMUM_WINDOW_SIZE;

        const win = new BrowserWindow({
            width, height,
            minWidth, minHeight,
            icon: staticPath.FAVICON,
            webPreferences: {
                preload: staticPath.PRELOAD,
                nodeIntegration: true,
                contextIsolation: true
            }
        });

        return win;
    }

    async #openNewWindow(existingWin?: BrowserWindow): Promise<BrowserWindow> {
        let win = existingWin ?? (await this.#createBrowserWindow());
        if (win == null) {
            runtime.logger.fatal('BrowserWindow is not created.');
            process.exit(1);
        }

        const winRef = new WeakRef(win);
        runtime.eventProcess.resetBrowserWindow(win);
        
        runtime.rtWorker.removeAllRTEventListeners();
        runtime.rtWorker.addRTEventListener((event: RTEventData) => {
            const window = winRef.deref();
            if (window) {
                window.webContents.send(IPCListenerPing.Request, event.id, event);
            }
            else {
                runtime.logger.warn(`RTEvent handle failed. BrowserWindow has been closed. (event id: ${event.id})`);
            }
        });

        const {
            dev, devUrl, showDevTool
        } = runtime.env;
        if (dev) {
            runtime.logger.debug(`DEV MODE`);
            runtime.logger.debug(`Entrypoint: ${devUrl}`);

            electronLocalshortcut.register(win, 'F12', () => {
                win.webContents.toggleDevTools();
            });
            electronLocalshortcut.register(win, 'F5', () => {
                win.reload();
            });

            win.loadURL(devUrl);

            if (showDevTool) {
                win.webContents.openDevTools({ mode: 'detach' });
            }
        }
        else {
            runtime.logger.debug(`RELEASE MODE`);
            runtime.logger.debug(`Entrypoint: file://${staticPath.STATIC_ENTRYPOINT}`);

            win.loadURL(`file://${staticPath.STATIC_ENTRYPOINT}`);

            if (showDevTool) {
                win.webContents.openDevTools({ mode: 'detach' });
            }
        }

        return win;
    }

    /** 애플리케이션 메뉴 설정, 최초 1회 실행 */
    #setupApplicationMenu() {
        if (process.platform === 'darwin') {
            const template = [
                {
                    label: 'Afron',
                    submenu: [
                        { label: 'About Afron', role: 'about' },
                        { type: 'separator' },
                        { label: 'Quit Afron', accelerator: 'Command+Q', click: () => app.quit() }
                    ]
                }
            ];

            const menu = Menu.buildFromTemplate(template as any);
            Menu.setApplicationMenu(menu);
        }
        else {
            Menu.setApplicationMenu(null);
        }
    }

    /** 앱 핸들러 설정, 최초 1회 실행 */
    async #setupAppHandler(app: Electron.App) {
        app.on('window-all-closed', async () => {
            runtime.logger.trace('[Electron][app] window-all-closed');

            if (process.platform !== 'darwin') {
                app.quit();
            }
        });

        app.on('activate', async () => {
            runtime.logger.trace('[Electron][app] activate');

            if (
                process.platform === 'darwin'
                && BrowserWindow.getAllWindows().length === 0
            ) {
                runtime.logger.info('Activating app, creating new window');

                const newWin = await this.#openNewWindow();
                await this.#setupWindowHandler(newWin);
            }
        });

        app.on('will-quit', async () => {
            runtime.logger.trace('[Electron][app] will-quit');
            runtime.logger.info('App is quitting, cleaning up...');

            try {
                globalShortcut.unregisterAll();
                await runtime.globalStorage.commitAll();
                await runtime.profiles.saveAll();
            }
            catch (error) {
                runtime.logger.error('Error during app quit:', error);
            }
        });
    }

    /** BrowserWindow 핸들러 설정, 윈도우 생성시 실행 */
    async #setupWindowHandler(win: BrowserWindow) {
        const cacheAC = await runtime.globalStorage.accessAsJSON('cache.json');
        const throttledResize = throttle(500);

        win.on('resize', () => {
            runtime.logger.trace('[Electron][win] resize');

            const [width, height] = win.getSize();
            throttledResize(() => {
                cacheAC.setOne('lastsize', [width, height]);
            });
        });

        win.on('close', async (event) => {
            runtime.logger.trace('[Electron][win] close');

            runtime.logger.info('Window closed');
        });
    }
}

export default ElectronApp;