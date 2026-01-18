import { CryptoAdapterUnavailableError } from './errors';
import type { CryptoAdapterProvider } from './types';

class CryptoAdapter {
    constructor(private readonly provider: CryptoAdapterProvider) {}

    async isAvailable(): Promise<boolean> {
        return this.provider.isAvailable();
    }

    supportsSync(): boolean {
        return Boolean(this.provider.isAvailableSync && this.provider.encryptSync && this.provider.decryptSync);
    }

    isAvailableSync(): boolean {
        if (!this.provider.isAvailableSync) {
            throw new CryptoAdapterUnavailableError('Synchronous availability check is not supported');
        }

        return this.provider.isAvailableSync();
    }

    async encrypt(plain: string): Promise<string> {
        return this.provider.encrypt(plain);
    }

    encryptSync(plain: string): string {
        if (!this.provider.encryptSync) {
            throw new CryptoAdapterUnavailableError('Synchronous encryption is not supported');
        }

        return this.provider.encryptSync(plain);
    }

    async decrypt(cipher: string): Promise<string> {
        return this.provider.decrypt(cipher);
    }

    decryptSync(cipher: string): string {
        if (!this.provider.decryptSync) {
            throw new CryptoAdapterUnavailableError('Synchronous decryption is not supported');
        }

        return this.provider.decryptSync(cipher);
    }
}

export default CryptoAdapter;
