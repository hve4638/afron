import fs from 'node:fs';
import path from 'node:path';
import * as writeFileAtomic from 'write-file-atomic';

/**
 * 파일 로드 후 값을 빠르게 가져올 수 있는 최소 기능 동기식 설정 저장소
 * 
 * 하드웨어 가속 비활성화 등, Electron app 시작 전에 설정을 읽어야 하는 경우 사용
 */
export class FastStore<T extends Record<string, unknown>> {
    readonly #filePath: string;
    #data: Partial<T> = {};
    constructor(filePath: string) {
        this.#filePath = filePath;
    }

    load(): boolean {
        if (!fs.existsSync(this.#filePath)) {
            this.#data = {};
            return false;
        }

        const raw = fs.readFileSync(this.#filePath, 'utf-8');
        try {
            this.#data = JSON.parse(raw) as Partial<T>;
        }
        catch {
            this.#renameBak(this.#filePath);
            this.#data = {};
            return false;
        }

        return true;
    }

    #renameBak(target: string): void {
        if (!fs.existsSync(target)) return;

        const bak = `${target}.bak`
        try {
            if (fs.existsSync(bak)) fs.unlinkSync(bak);

            fs.renameSync(target, bak);
        } catch { }
    }

    save(): void {
        const dir = path.dirname(this.#filePath);
        fs.mkdirSync(dir, { recursive: true });

        const payload = JSON.stringify(this.#data, null, 2);
        writeFileAtomic.sync(this.#filePath, payload, { encoding: 'utf-8' });
    }

    get<K extends keyof T>(key: K): T[K] | undefined {
        return this.#data[key];
    }

    set<K extends keyof T>(key: K, value: T[K]): void {
        this.#data[key] = value;
    }
}
