import { beforeEach, describe, expect, test, vi } from 'vitest';
import { CryptoAdapterOperationError } from '@afron/core';

const mockSafeStorage = vi.hoisted(() => ({
    isEncryptionAvailable: vi.fn(),
    encryptString: vi.fn(),
    decryptString: vi.fn(),
}));

vi.mock('electron', () => ({
    safeStorage: mockSafeStorage,
}));

import HardwareCryptoProvider from './HardwareCryptoProvider';

describe('HardwareCryptoProvider', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('reports availability via safeStorage', async () => {
        mockSafeStorage.isEncryptionAvailable.mockReturnValue(true);
        await expect(HardwareCryptoProvider.isAvailable()).resolves.toBe(true);
        expect(HardwareCryptoProvider.isAvailableSync?.()).toBe(true);
        expect(mockSafeStorage.isEncryptionAvailable).toHaveBeenCalledTimes(2);
    });

    test('encrypts and decrypts using base64 payloads', async () => {
        const cipherBuffer = Buffer.from('cipher-data');
        mockSafeStorage.encryptString.mockReturnValueOnce(cipherBuffer);

        const encrypted = await HardwareCryptoProvider.encrypt('plain');
        expect(encrypted).toBe(cipherBuffer.toString('base64'));
        expect(mockSafeStorage.encryptString).toHaveBeenCalledWith('plain');

        const decryptSpy = mockSafeStorage.decryptString.mockImplementationOnce((value: unknown) => {
            expect(value).toEqual(cipherBuffer);
            return 'plain';
        });

        const decrypted = await HardwareCryptoProvider.decrypt(cipherBuffer.toString('base64'));
        expect(decrypted).toBe('plain');
        expect(decryptSpy).toHaveBeenCalledTimes(1);
    });

    test('supports sync encrypt/decrypt with base64 payloads', () => {
        const cipherBuffer = Buffer.from('sync-cipher');
        mockSafeStorage.encryptString.mockReturnValueOnce(cipherBuffer);

        const encrypted = HardwareCryptoProvider.encryptSync?.('plain-sync');
        expect(encrypted).toBe(cipherBuffer.toString('base64'));
        expect(mockSafeStorage.encryptString).toHaveBeenCalledWith('plain-sync');

        const decryptSpy = mockSafeStorage.decryptString.mockImplementationOnce((value: unknown) => {
            expect(value).toEqual(cipherBuffer);
            return 'plain-sync';
        });

        const decrypted = HardwareCryptoProvider.decryptSync?.(cipherBuffer.toString('base64'));
        expect(decrypted).toBe('plain-sync');
        expect(decryptSpy).toHaveBeenCalledTimes(1);
    });

    test('wraps encryption errors in CryptoAdapterOperationError', async () => {
        mockSafeStorage.encryptString.mockImplementationOnce(() => {
            throw new Error('boom');
        });

        await expect(HardwareCryptoProvider.encrypt('plain')).rejects.toBeInstanceOf(
            CryptoAdapterOperationError,
        );
    });

    test('wraps decryption errors in CryptoAdapterOperationError (sync)', () => {
        mockSafeStorage.decryptString.mockImplementationOnce(() => {
            throw new Error('boom');
        });

        expect(() => HardwareCryptoProvider.decryptSync?.('bad')).toThrow(CryptoAdapterOperationError);
    });
});
