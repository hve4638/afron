import { app } from 'electron';
import ElectronApp from '@/features/elctron-app';
import { showMessage } from '@/utils';
import initialize from '@/initialize';
import { FastStore } from '@/features/fast-store'

const store = FastStore.instance();
store.load();

const hardwareAccelerationEnabled = store.get('hardware_acceleration_enabled') ?? true;
if (!hardwareAccelerationEnabled) {
    app.disableHardwareAcceleration();
    console.log('Hardware acceleration is disabled.');
}

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