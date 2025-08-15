import { EventEmitter } from 'events';

import NoLogger from '@/features/nologger';
import { LevelLogger } from '@/types';

import { RTClosed } from './errors';

export type RTEventListener = (data: RTEventData) => unknown;

const EMITTER_DEFAULT_EVENT = 'default';

class RTEventEmitter {
    protected logger: LevelLogger;

    #id: string;
    #disabled: boolean = false;
    #emitter = new EventEmitter();

    constructor(identifier: string, logger?: LevelLogger) {
        this.#id = identifier;
        this.logger = logger ?? NoLogger.instance;
    }

    get disabled() {
        return this.#disabled;
    }

    on(listener: RTEventListener) {
        this.#emitter.on(EMITTER_DEFAULT_EVENT, listener);

        return () => this.off(listener);
    }

    off(listener: RTEventListener) {
        this.#emitter.off(EMITTER_DEFAULT_EVENT, listener);
    }

    offAll() {
        this.#emitter.removeAllListeners(EMITTER_DEFAULT_EVENT);
    }

    disable() {
        this.#disabled = true;
    }

    #send(eventData: RTEventDataWithoutId) {
        if (this.disabled) throw new RTClosed();

        this.#sendForce(eventData);
    }

    #sendForce(eventData: RTEventDataWithoutId) {
        const fullEventData: RTEventData = {
            id: this.#id,
            ...eventData,
        };
        try {
            this.#emitter.emit(EMITTER_DEFAULT_EVENT, fullEventData);
        }
        catch (e) {
            this.logger.error(`RTEmitter.#sendForce Error occured (${this.#id})`, e);
        }
    }

    readonly emit = {
        update: {
            input: () => {
                this.logger.debug(`[RTEventEmitter] update: input (${this.#id})`);
                this.#send({
                    type: 'update',
                    update_types: ['input'],
                });
            },
            output: () => {
                this.logger.debug(`[RTEventEmitter] update: output (${this.#id})`);
                this.#send({
                    type: 'update',
                    update_types: ['output'],
                });
            },
            history: () => {
                this.logger.debug(`[RTEventEmitter] update: history (${this.#id})`);
                this.#send({
                    type: 'update',
                    update_types: ['history'],
                });
            }
        },
        send: {
            rawRequestPreview: (data: RTEventPreviewData) => {
                this.logger.debug(`[RTEventEmitter] send: raw_request_preview (${this.#id})`, JSON.stringify(data));
                this.#send({
                    type: 'send_raw_request_preview',
                    preview: data,
                });
            },

            info: (title: string, description: string, item: { name?: string; value: string; }[]) => {
                this.logger.debug(`[RTEventEmitter] send: info (${this.#id})`, JSON.stringify(item));
                this.#send({
                    type: 'send_info',
                    title,
                    description,
                    item: item,
                });
            }
        },
        output: {
            set: (text: string) => {
                this.logger.debug(`[RTEventEmitter] set_output (${this.#id})`, text);
                this.#send({
                    type: 'set_output',
                    text: text,
                });
            },
            streamThinking: (text: string) => {

            },
            thinking: (text: string) => {

            },
            streamOutput: (text: string) => {
                this.logger.debug(`[RTEventEmitter] stream_output (${this.#id})`, text);
                this.#send({
                    type: 'stream_output',
                    text: '',
                });
            },
            clearOutput: () => {
                this.logger.debug(`[RTEventEmitter] clear_output (${this.#id})`);

                this.#send({
                    type: 'clear_output',
                });
            },
        },
        error: {
            noResult: (detail: string[] = []) => {
                this.logger.debug(`[RTEventEmitter] error: no_result (${this.#id})`);

                this.#send({
                    type: 'error',
                    reason_id: 'no_result',
                    detail: detail,
                });
            },
            promptBuildFailed: (detail: string[] = []) => {

            },
            promptEvaluateFailed: (detail: string[] = []) => { },
            fetchFailed: (detail: string[] = []) => {
                this.logger.debug(`[RTEventEmitter] error: fetch_failed (${this.#id})`);
                this.#send({
                    type: 'error',
                    reason_id: 'fetch_failed',
                    detail: detail,
                });
            },
            httpError: (http_status: number, detail: string[] = []) => {
                this.logger.debug(`[RTEventEmitter] error: http_error (${this.#id})`);

                this.#send({
                    type: 'error',
                    reason_id: 'http_error',
                    http_status: http_status,
                    detail: detail,
                });
            },
            requestFailed: (detail: string[] = []) => { },
            aborted: (detail: string[] = []) => { },
            invalidModel: (detail: string[] = []) => {
                this.logger.debug(`[RTEventEmitter] error: invalid_model (${this.#id})`);
                this.#sendForce({
                    type: 'error',
                    reason_id: 'invalid_model',
                    detail: detail,
                });
            },

            envError: (title: string, detail: string[] = []) => {
                this.logger.debug(`[RTEventEmitter] error: env_error (${this.#id})`);
                this.#sendForce({
                    type: 'error',
                    reason_id: 'env_error',
                    title, detail,
                });
            },
            other: (detail: string[] = []) => {
                this.logger.debug(`RTEventEmitter] RTSender.error.other (${this.#id})`);
                this.#sendForce({
                    type: 'error',
                    reason_id: 'other',
                    detail: detail,
                });
            },
        },
        directive: {
            close: () => {
                this.logger.debug(`RTSender.sendClose (${this.#id})`);
                this.#sendForce({
                    type: 'close',
                });
            },
        }
    } as const;
}

export default RTEventEmitter;