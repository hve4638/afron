export class CryptoAdapterUnavailableError extends Error {
    constructor(message = 'Crypto adapter provider is unavailable') {
        super(message);
        this.name = 'CryptoAdapterUnavailableError';
    }
}

export class CryptoAdapterOperationError extends Error {
    constructor(message = 'Crypto adapter operation failed') {
        super(message);
        this.name = 'CryptoAdapterOperationError';
    }
}
