import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { FastStoreConfig } from './constants';

export class FastStore<
    T extends Record<string, any> = Record<string, any>
> {
    readonly #filePath: string = path.resolve(os.homedir(), '.afron/config.json');
    #data: T = {} as T;

    static #instance: FastStore<any> | null = null;
    static instance(): FastStore<FastStoreConfig> {
        this.#instance ??= new FastStore<FastStoreConfig>();
        return this.#instance;
    }

    private constructor() { }

    load(): boolean {
        if (!fs.existsSync(this.#filePath)) {
            this.#data = {} as T;
            return false;
        }

        const raw = fs.readFileSync(this.#filePath, 'utf-8');
        try {
            this.#data = JSON.parse(raw) as T;
        }
        catch {
            this.#data = {} as T;
            return false;
        }
        return true;
    }

    save(): void {
        const dir = path.dirname(this.#filePath);
        fs.mkdirSync(dir, { recursive: true });
        const payload = JSON.stringify(this.#data, null, 2);
        const tempPath = `${this.#filePath}.${process.pid}.tmp`;
        fs.writeFileSync(tempPath, payload, 'utf-8');
        try {
            fs.renameSync(tempPath, this.#filePath);
        }
        catch (error) {
            if (fs.existsSync(this.#filePath)) fs.rmSync(this.#filePath, { force: true });
            fs.renameSync(tempPath, this.#filePath);
        }
    }

    get<K extends keyof T>(key: K): T[K] | undefined {
        return this.#data[key];
    }

    set<K extends keyof T>(key: K, value: T[K]): void {
        this.#data[key] = value;
    }
}
