export class EventClosed extends Error {
    constructor() {
        super('EventEmitter is closed');
    }
}

