import { safeStorage } from 'electron';
import { CryptoAdapterOperationError, type CryptoAdapterProvider } from '@afron/core';

const encodeCipher = (cipher: Buffer): string => cipher.toString('base64');
const decodeCipher = (cipher: string): Buffer => Buffer.from(cipher, 'base64');

const wrapError = (message: string, error: unknown): CryptoAdapterOperationError => {
    const detail = error instanceof Error ? error.message : String(error);
    return new CryptoAdapterOperationError(`${message}: ${detail}`);
};

const HardwareCryptoProvider: CryptoAdapterProvider = {
    async isAvailable(): Promise<boolean> {
        return safeStorage.isEncryptionAvailable();
    },
    isAvailableSync(): boolean {
        return safeStorage.isEncryptionAvailable();
    },
    async encrypt(plain: string): Promise<string> {
        try {
            const cipher = safeStorage.encryptString(plain);
            return encodeCipher(cipher);
        }
        catch (error) {
            throw wrapError('Failed to encrypt with hardware crypto', error);
        }
    },
    encryptSync(plain: string): string {
        try {
            const cipher = safeStorage.encryptString(plain);
            return encodeCipher(cipher);
        }
        catch (error) {
            throw wrapError('Failed to encrypt with hardware crypto', error);
        }
    },
    async decrypt(cipher: string): Promise<string> {
        try {
            const decrypted = safeStorage.decryptString(decodeCipher(cipher));
            return decrypted;
        }
        catch (error) {
            throw wrapError('Failed to decrypt with hardware crypto', error);
        }
    },
    decryptSync(cipher: string): string {
        try {
            const decrypted = safeStorage.decryptString(decodeCipher(cipher));
            return decrypted;
        }
        catch (error) {
            throw wrapError('Failed to decrypt with hardware crypto', error);
        }
    },
};

export default HardwareCryptoProvider;
