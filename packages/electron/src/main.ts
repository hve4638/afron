import { app } from 'electron';
import ElectronApp from '@/features/elctron-app';
import { showMessage } from '@/utils';
import initialize from '@/initialize';
import { GlobalStore } from '@/features/global-store';

const config = GlobalStore.config();

const hardwareAccelerationEnabled = config.get('hardware_acceleration_enabled') ?? true;
if (!hardwareAccelerationEnabled) {
    app.disableHardwareAcceleration();
    console.log('Hardware acceleration is disabled.');
}

async function main() {
    const gotLocked = app.requestSingleInstanceLock();

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