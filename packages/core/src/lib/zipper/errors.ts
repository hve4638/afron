export class ZipBuilderError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ZipBuilderError';
    }
}