export class UnZipperError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UnZipperError';
    }
}