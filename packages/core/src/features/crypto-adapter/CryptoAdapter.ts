import { CryptoAdapterUnavailableError } from './errors';
import type { CryptoAdapterProvider } from './types';

class CryptoAdapter {
    private readonly asyncProvider: Pick<CryptoAdapterProvider, 'isAvailable' | 'encrypt' | 'decrypt'>;
    private readonly syncProvider?: Pick<
        CryptoAdapterProvider,
        'isAvailableSync' | 'encryptSync' | 'decryptSync'
    >;
    private readonly supportsSyncAPI: boolean;

    constructor(private readonly provider: CryptoAdapterProvider) {
        const asyncProvider = provider as Partial<CryptoAdapterProvider>;
        const hasAsync = Boolean(asyncProvider.isAvailable && asyncProvider.encrypt && asyncProvider.decrypt);
        const hasSync = Boolean(asyncProvider.isAvailableSync && asyncProvider.encryptSync && asyncProvider.decryptSync);

        if (!hasAsync && !hasSync) {
            throw new CryptoAdapterUnavailableError('Crypto provider must support async or sync APIs.');
        }

        this.supportsSyncAPI = hasSync;

        if (hasAsync) {
            this.asyncProvider = {
                isAvailable: provider.isAvailable.bind(provider),
                encrypt: provider.encrypt.bind(provider),
                decrypt: provider.decrypt.bind(provider),
            };
        }
        else {
            this.asyncProvider = {
                isAvailable: async () => provider.isAvailableSync!(),
                encrypt: async (plain: string) => provider.encryptSync!(plain),
                decrypt: async (cipher: string) => provider.decryptSync!(cipher),
            };
        }

        if (hasSync) {
            this.syncProvider = {
                isAvailableSync: provider.isAvailableSync!.bind(provider),
                encryptSync: provider.encryptSync!.bind(provider),
                decryptSync: provider.decryptSync!.bind(provider),
            };
        }
    }

    async isAvailable(): Promise<boolean> {
        return this.asyncProvider.isAvailable();
    }

    supportSyncAPI(): boolean {
        return this.supportsSyncAPI;
    }

    isAvailableSync(): boolean {
        if (!this.syncProvider) {
            return false;
        }

        return this.syncProvider.isAvailableSync!();
    }

    async encrypt(plain: string): Promise<string> {
        return this.asyncProvider.encrypt(plain);
    }

    encryptSync(plain: string): string {
        if (!this.syncProvider) {
            throw new CryptoAdapterUnavailableError('Synchronous encryption is not supported.');
        }

        return this.syncProvider.encryptSync!(plain);
    }

    async decrypt(cipher: string): Promise<string> {
        return this.asyncProvider.decrypt(cipher);
    }

    decryptSync(cipher: string): string {
        if (!this.syncProvider) {
            throw new CryptoAdapterUnavailableError('Synchronous decryption is not supported.');
        }

        return this.syncProvider.decryptSync!(cipher);
    }
}

export default CryptoAdapter;
