import { describe, expect, test, vi } from 'vitest';
import CryptoAdapter from './CryptoAdapter';
import { CryptoAdapterUnavailableError } from './errors';
import type { CryptoAdapterProvider } from './types';

const createProvider = (): CryptoAdapterProvider => ({
    isAvailable: vi.fn(async () => true),
    encrypt: vi.fn(async (plain: string) => `enc:${plain}`),
    decrypt: vi.fn(async (cipher: string) => cipher.replace('enc:', '')),
    isAvailableSync: vi.fn(() => true),
    encryptSync: vi.fn((plain: string) => `enc:${plain}`),
    decryptSync: vi.fn((cipher: string) => cipher.replace('enc:', '')),
});

describe('CryptoAdapter', () => {
    test('delegates async methods to provider', async () => {
        const provider = createProvider();
        const crypto = new CryptoAdapter(provider);

        await expect(crypto.isAvailable()).resolves.toBe(true);
        await expect(crypto.encrypt('data')).resolves.toBe('enc:data');
        await expect(crypto.decrypt('enc:data')).resolves.toBe('data');

        expect(provider.isAvailable).toHaveBeenCalledTimes(1);
        expect(provider.encrypt).toHaveBeenCalledWith('data');
        expect(provider.decrypt).toHaveBeenCalledWith('enc:data');
    });

    test('delegates sync methods when available', () => {
        const provider = createProvider();
        const crypto = new CryptoAdapter(provider);

        expect(crypto.supportSyncAPI()).toBe(true);
        expect(crypto.isAvailableSync()).toBe(true);
        expect(crypto.encryptSync('data')).toBe('enc:data');
        expect(crypto.decryptSync('enc:data')).toBe('data');

        expect(provider.isAvailableSync).toHaveBeenCalledTimes(1);
        expect(provider.encryptSync).toHaveBeenCalledWith('data');
        expect(provider.decryptSync).toHaveBeenCalledWith('enc:data');
    });

    test('treats async-only providers as sync-unavailable', () => {
        const provider: CryptoAdapterProvider = {
            isAvailable: vi.fn(async () => true),
            encrypt: vi.fn(async (plain: string) => `enc:${plain}`),
            decrypt: vi.fn(async (cipher: string) => cipher.replace('enc:', '')),
        };
        const crypto = new CryptoAdapter(provider);

        expect(crypto.supportSyncAPI()).toBe(false);
        expect(crypto.isAvailableSync()).toBe(false);
        expect(() => crypto.encryptSync('data')).toThrow(CryptoAdapterUnavailableError);
        expect(() => crypto.decryptSync('enc:data')).toThrow(CryptoAdapterUnavailableError);
    });

    test('bridges sync-only providers to async APIs', async () => {
        const provider = {
            isAvailableSync: vi.fn(() => true),
            encryptSync: vi.fn((plain: string) => `enc:${plain}`),
            decryptSync: vi.fn((cipher: string) => cipher.replace('enc:', '')),
        } as unknown as CryptoAdapterProvider;
        const crypto = new CryptoAdapter(provider);

        await expect(crypto.isAvailable()).resolves.toBe(true);
        await expect(crypto.encrypt('data')).resolves.toBe('enc:data');
        await expect(crypto.decrypt('enc:data')).resolves.toBe('data');
        expect(crypto.isAvailableSync()).toBe(true);

        expect(provider.isAvailableSync).toHaveBeenCalledTimes(2);
        expect(provider.encryptSync).toHaveBeenCalledWith('data');
        expect(provider.decryptSync).toHaveBeenCalledWith('enc:data');
        expect(crypto.supportSyncAPI()).toBe(true);
    });

    test('throws when provider supports neither async nor sync APIs', () => {
        const provider = {} as CryptoAdapterProvider;

        expect(() => new CryptoAdapter(provider)).toThrow(CryptoAdapterUnavailableError);
    });
});
