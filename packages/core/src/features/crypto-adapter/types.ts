export interface CryptoAdapterProvider {
    isAvailable(): Promise<boolean>;
    encrypt(plain: string): Promise<string>;
    decrypt(cipher: string): Promise<string>;
    isAvailableSync?(): boolean;
    encryptSync?(plain: string): string;
    decryptSync?(cipher: string): string;
}
