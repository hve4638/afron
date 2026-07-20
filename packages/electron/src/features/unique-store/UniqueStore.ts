import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { app } from 'electron';
import { personal } from 'win-known-folders';

import { UniqueStoreSchema } from './types';
import { pathDebug, pathDebugError } from '@/utils/pathDebug';

class UniqueStore {
    static readonly AppName = 'afron';
    static readonly ConfigFileName = 'afron.config.json';
    static #instance: UniqueStore | null = null;
    #path: string;

    static instance() {
        this.#instance ??= new UniqueStore();

        return this.#instance;
    }

    private constructor() {
        this.#path = this.#getConfigPath();
        pathDebug('UniqueStore: config path =', this.#path, 'exists =', fs.existsSync(this.#path));
    }

    #getConfigPath(): string {
        return path.join(app.getPath('appData'), UniqueStore.AppName, UniqueStore.ConfigFileName);
    }

    get path(): string {
        return this.#path;
    }

    setSavePath(savePath: string): void {
        this.#validatePath(savePath);

        const config = this.#readConfig();
        config.savePath = savePath;
        this.#writeConfig(config);
    }

    getSavePath(): string | null {
        const config = this.#readConfig();
        pathDebug('UniqueStore.getSavePath: raw savePath =', config.savePath ?? '(missing)');

        if (config.savePath) {
            try {
                this.#validatePath(config.savePath);

                pathDebug('UniqueStore.getSavePath: validated OK');
                return config.savePath;
            }
            catch (error) {
                pathDebugError('UniqueStore.getSavePath: validatePath failed:', error);
            }
        }

        return null;
    }
    
    setSavePathAsDefault(): void {
        const defaultPath = this.#getDefaultSavePath();

        if (!fs.existsSync(defaultPath)) {
            fs.mkdirSync(defaultPath, { recursive: true });
        }

        this.setSavePath(defaultPath);
    }

    #getDefaultSavePath(): string {
        const platform = os.platform();

        switch (platform) {
            case 'win32':
                return this.#getWindowsDefaultSavePath();
            case 'darwin':
                return path.join(app.getPath('documents'), 'Afron');
            case 'linux':
                try {
                    return path.join(app.getPath('documents'), '.afron');
                }
                catch (error) {
                    console.log(error);
                    return path.join(os.homedir(), '.afron');
                }
            default:
                return path.join(os.homedir(), '.afron');
        }
    }

    #getWindowsDefaultSavePath(): string {
        const docu = personal('cp949');
        if (docu) {
            const legacyPath = path.join(docu, 'Afron');
            if (fs.existsSync(docu)) {
                return legacyPath;
            }
        }

        return path.join(app.getPath('documents'), 'Afron');
    }

    #readConfig(): Partial<UniqueStoreSchema> {
        try {
            if (fs.existsSync(this.#path)) {
                const content = fs.readFileSync(this.#path, 'utf-8');
                return JSON.parse(content);
            }
            pathDebug('UniqueStore.#readConfig: file not found:', this.#path);
        }
        catch (error) {
            pathDebugError('UniqueStore.#readConfig: read/parse failed:', error);
        }

        return {};
    }

    #writeConfig(config: Partial<UniqueStoreSchema>): void {
        const configDir = path.dirname(this.#path);

        if (!fs.existsSync(configDir)) {
            fs.mkdirSync(configDir, { recursive: true });
        }

        fs.writeFileSync(this.#path, JSON.stringify(config, null, 2), 'utf-8');
    }

    #validatePath(targetPath: string): void {
        if (!fs.existsSync(targetPath)) {
            throw new Error(`Path does not exist: ${targetPath}`);
        }

        const stats = fs.statSync(targetPath);
        if (!stats.isDirectory()) {
            throw new Error(`Path is not a directory: ${targetPath}`);
        }

        const testFile = path.join(targetPath, '.afron-test-write-permission');
        try {
            fs.writeFileSync(testFile, 'test');
            fs.unlinkSync(testFile);
        }
        catch (error) {
            throw new Error(`Insufficient write permissions for path: ${targetPath}`);
        }
    }
}

export default UniqueStore;