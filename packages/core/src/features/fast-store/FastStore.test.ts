import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { FastStore } from './FastStore';

type SampleStore = {
    foo: string;
    count: number;
};

describe('FastStore', () => {
    it('returns false on load when file is missing', () => {
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fast-store-'));
        const filePath = path.join(dir, 'settings.json');
        const store = new FastStore<SampleStore>(filePath);

        const loaded = store.load();

        expect(loaded).toBe(false);
        expect(store.get('foo')).toBeUndefined();
    });

    it('persists and reloads data after save', () => {
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fast-store-'));
        const filePath = path.join(dir, 'settings.json');
        const store = new FastStore<SampleStore>(filePath);

        store.set('foo', 'bar');
        store.set('count', 3);
        store.save();

        const reloaded = new FastStore<SampleStore>(filePath);
        const loaded = reloaded.load();

        expect(loaded).toBe(true);
        expect(reloaded.get('foo')).toBe('bar');
        expect(reloaded.get('count')).toBe(3);
    });

    it('overwrites existing keys when set is called again', () => {
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fast-store-'));
        const filePath = path.join(dir, 'settings.json');
        const store = new FastStore<SampleStore>(filePath);

        store.set('foo', 'first');
        store.set('foo', 'second');

        expect(store.get('foo')).toBe('second');
    });

    it('backs up invalid JSON and returns false on load', () => {
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fast-store-'));
        const filePath = path.join(dir, 'settings.json');
        fs.writeFileSync(filePath, '{ invalid json', 'utf-8');

        const store = new FastStore<SampleStore>(filePath);
        const loaded = store.load();
        const backupPath = `${filePath}.bak`;

        expect(loaded).toBe(false);
        expect(fs.existsSync(backupPath)).toBe(true);
        expect(store.get('foo')).toBeUndefined();
    });
});
