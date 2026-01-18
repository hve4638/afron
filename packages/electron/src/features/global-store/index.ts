import os from 'node:os';
import path from 'node:path';

import { FastStore } from '@afron/core';
import { GlobalStoreConfig } from './types';

const APP_DIR = path.resolve(os.homedir(), '.afron');
const CONFIG_PATH = path.resolve(APP_DIR, 'config.json');

let configInstance: FastStore<GlobalStoreConfig> | null = null;
export const GlobalStore = {
    config() {
        configInstance ??= new FastStore(CONFIG_PATH);
        
        return configInstance;
    }
} as const;

