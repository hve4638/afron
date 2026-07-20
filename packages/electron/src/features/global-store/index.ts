import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { FastStore } from '@afron/core';
import { GlobalStoreConfig } from './types';
import { pathDebug } from '@/utils/pathDebug';

const APP_DIR = path.resolve(os.homedir(), '.afron');
const CONFIG_PATH = path.resolve(APP_DIR, 'config.json');

let configInstance: FastStore<GlobalStoreConfig> | null = null;
export const GlobalStore = {
    config(): FastStore<GlobalStoreConfig> {
        if (configInstance == null) {
            configInstance = new FastStore(CONFIG_PATH);
            const loaded = configInstance.load();
            pathDebug('GlobalStore.config: path =', CONFIG_PATH, 'exists =', fs.existsSync(CONFIG_PATH), 'loaded =', loaded, 'save_path =', configInstance.get('save_path') ?? '(null)');
        }

        return configInstance;
    }
} as const;

