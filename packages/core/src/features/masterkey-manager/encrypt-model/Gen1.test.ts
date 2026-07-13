import crypto from 'crypto';
import { describe, expect, test, vi } from 'vitest';
import EncryptModelGen1 from './Gen1';
import AES from '@/lib/crypt-wrapper/AES';

vi.mock('@/lib/crypt-wrapper/AES', () => ({
    default: vi.fn(),
}));

const mockAesEncrypt = vi.fn();
const mockAesDecrypt = vi.fn();
const mockAesInstance = {
    encrypt: mockAesEncrypt,
    decrypt: mockAesDecrypt,
    setKey: vi.fn(),
} as unknown as AES;

vi.mocked(AES).mockImplementation(() => mockAesInstance);

describe('EncryptModelGen1', () => {
    test('encrypt uses scryptSync and wraps payload with signature', async () => {
        const scryptSpy = vi.spyOn(crypto, 'scryptSync').mockReturnValue(Buffer.alloc(32));
        mockAesEncrypt.mockReturnValue({ iv: 'iv-token', data: 'enc-data' });

        const model = new EncryptModelGen1();
        const result = await model.encrypt('payload', 'secret-key');

        expect(scryptSpy).toHaveBeenCalledWith('secret-key', 'AFRON', 32);
        expect(mockAesEncrypt).toHaveBeenCalledWith('AFRON_payload');
        expect(result).toBe('1:iv-token:enc-data');

        scryptSpy.mockRestore();
    });

    test('decrypt uses scryptSync and returns plain payload', async () => {
        const scryptSpy = vi.spyOn(crypto, 'scryptSync').mockReturnValue(Buffer.alloc(32));
        mockAesDecrypt.mockReturnValue('AFRON_plain-text');

        const model = new EncryptModelGen1();
        const result = await model.decrypt('1:iv-token:enc-data', 'secret-key');

        expect(scryptSpy).toHaveBeenCalledWith('secret-key', 'AFRON', 32);
        expect(mockAesDecrypt).toHaveBeenCalledWith('enc-data', 'iv-token');
        expect(result).toBe('plain-text');

        scryptSpy.mockRestore();
    });

    test('decrypt throws when signature mismatch', async () => {
        vi.spyOn(crypto, 'scryptSync').mockReturnValue(Buffer.alloc(32));
        mockAesDecrypt.mockReturnValue('INVALID_plain-text');

        const model = new EncryptModelGen1();

        await expect(model.decrypt('1:iv-token:enc-data', 'secret-key')).rejects.toThrow('Invalid data');
    });
});
