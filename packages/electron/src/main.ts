import { app } from 'electron';
import ElectronApp from '@/features/elctron-app';
import { showMessage } from '@/utils';
import initialize from '@/initialize';
import { GlobalStore } from '@/features/global-store';
import { pathDebug, pathDebugError } from '@/utils/pathDebug';

process.on('uncaughtException', (error) => {
    pathDebugError('main: uncaughtException:', error);
});
process.on('unhandledRejection', (reason) => {
    pathDebugError('main: unhandledRejection:', reason);
});

const config = GlobalStore.config();

const hardwareAccelerationEnabled = config.get('hardware_acceleration_enabled') ?? true;
if (!hardwareAccelerationEnabled) {
    app.disableHardwareAcceleration();
    console.log('Hardware acceleration is disabled.');
}

async function main() {
    const gotLocked = app.requestSingleInstanceLock();

    if (gotLocked === false) {
        pathDebug('main: single instance lock failed, exiting (another instance is running)');
        console.error('Afron is already running.');
        if (!app.isPackaged) showMessage('Afron is already running.');
        process.exit(0);
    }

    await initialize();

    pathDebug('main: initialize done, starting ElectronApp');
    const electronApp = new ElectronApp();
    await electronApp.run();
    pathDebug('main: ElectronApp.run done');
}

main().catch((error) => {
    pathDebugError('main: fatal error during startup:', error);
});