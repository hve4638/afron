import { app } from 'electron';
import ElectronApp from '@/features/elctron-app';
import { showMessage } from '@/utils';
import initialize from '@/initialize';
import { FastStore } from '@/features/fast-store'

const store = FastStore.instance();
store.load();

const disableHardwareAcceleration = store.get('disable_hardware_acceleration') ?? false;
if (disableHardwareAcceleration) app.disableHardwareAcceleration();

const gotLocked = app.requestSingleInstanceLock();

async function main() {
    if (gotLocked === false) {
        console.error('Afron is already running.');
        if (!app.isPackaged) showMessage('Afron is already running.');
        process.exit(0);
    }
    
    await initialize();
    
    const electronApp = new ElectronApp();
    await electronApp.run();
}

main();