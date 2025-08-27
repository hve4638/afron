export class EventPipeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'EventPipeError';
    }
}
