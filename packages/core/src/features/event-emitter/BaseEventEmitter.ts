import { EventEmitter } from 'node:events';

import NoLogger from '@/features/nologger';
import { LevelLogger } from '@/types';
import { EventClosed } from './errors';
import { EMITTER_DEFAULT_EVENT } from './data';

class BaseEventEmitter<
    TEventData extends { id: string },
    TEventDataWithoutId = Omit<TEventData, 'id'>
> {
    protected logger: LevelLogger;

    #disabled: boolean = false;
    #emitter = new EventEmitter();

    constructor(protected token: string, logger?: LevelLogger) {
        this.logger = logger ?? NoLogger.instance;
    }

    get disabled() {
        return this.#disabled;
    }

    on(listener: (data: TEventData) => unknown) {
        this.#emitter.on(EMITTER_DEFAULT_EVENT, listener);

        return () => this.off(listener);
    }

    off(listener: (data: TEventData) => unknown) {
        this.#emitter.off(EMITTER_DEFAULT_EVENT, listener);
    }

    offAll() {
        this.#emitter.removeAllListeners(EMITTER_DEFAULT_EVENT);
    }

    disable() {
        this.#disabled = true;
    }

    protected send(eventData: TEventDataWithoutId) {
        if (this.disabled) throw new EventClosed();

        this.sendForce(eventData);
    }

    protected sendForce(eventData: TEventDataWithoutId) {
        const fullEventData = {
            id: this.token,
            ...eventData,
        };
        try {
            this.#emitter.emit(EMITTER_DEFAULT_EVENT, fullEventData);
        }
        catch (e) {
            this.logger.error(`SendForce: Error occured (${this.token})`, e);
        }
    }
}

export default BaseEventEmitter;