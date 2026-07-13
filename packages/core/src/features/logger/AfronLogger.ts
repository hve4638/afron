import fs from 'fs';
import path from 'path';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { LogLevel, LogOptions } from './types';
import { LevelLogger } from '@/types';
import { uuidv7 } from '@/lib/uuid';

const logLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
};

class AfronLogger implements LevelLogger {
    #logger: winston.Logger;
    #level: LogLevel = LogLevel.INFO;
    #closed: boolean = false;
    #instanceId: string = uuidv7();

    constructor(logDirectory: string, options: LogOptions = {}) {
        const {
            verbose = false,
            level = LogLevel.INFO
        } = options;
        this.#level = level;

        if (!fs.existsSync(logDirectory)) {
            fs.mkdirSync(logDirectory, { recursive: true });
        }
        else if (!fs.statSync(logDirectory).isDirectory()) {
            throw new Error(`Log path exists but is not a directory: ${logDirectory}`);
        }

        const enableDebug = level <= LogLevel.DEBUG;
        const enableTrace = level <= LogLevel.TRACE;

        const format = winston.format.combine(
            winston.format.timestamp({
                format: () => new Date().toISOString()
            }),
            winston.format.printf(({ timestamp, level: logLevel, message, meta }) => {
                const base = `${timestamp} ${String(logLevel)}:\t${String(message ?? '')}`.trimEnd();

                const metaText = AfronLogger.#formatMeta(meta);
                return metaText ? `${base} ${metaText}` : base;
            })
        );

        const jsonFormat = winston.format.combine(
            winston.format.timestamp({
                format: () => new Date().toISOString()
            }),
            winston.format.json()
        );

        const transports: winston.transport[] = [
            new DailyRotateFile({
                dirname: path.resolve(logDirectory),
                filename: 'app-%DATE%.log',
                datePattern: 'YYMMDD',
                maxFiles: '90d'
            })
        ];

        if (enableDebug) {
            transports.push(new DailyRotateFile({
                dirname: path.resolve(logDirectory),
                filename: 'app-%DATE%.debug.log',
                datePattern: 'YYMMDD',
                maxFiles: '90d',
                level: 'debug',
                format: jsonFormat,
            }));
        }

        if (enableTrace) {
            transports.push(new DailyRotateFile({
                dirname: path.resolve(logDirectory),
                filename: 'app-%DATE%.trace.log',
                datePattern: 'YYMMDD',
                maxFiles: '90d',
                level: 'trace',
                format: jsonFormat,
            }));
        }

        if (verbose) {
            transports.push(new winston.transports.Console());
        }

        this.#logger = winston.createLogger({
            level: this.#getLogLevelName(level),
            levels: logLevels,
            format,
            transports,
            exitOnError: false,
        });

        this.info(`Log file created`);
    }

    get instanceId(): string {
        return this.#instanceId;
    }

    static #formatMeta(meta: unknown): string {
        if (meta === undefined) return '';
        try {
            return JSON.stringify(meta);
        }
        catch (error) {
            return JSON.stringify({ error: 'Unserializable meta' });
        }
    }

    #getLogLevelName(level: LogLevel): string {
        switch (level) {
            case LogLevel.TRACE: return 'trace';
            case LogLevel.DEBUG: return 'debug';
            case LogLevel.INFO: return 'info';
            case LogLevel.WARN: return 'warn';
            case LogLevel.ERROR: return 'error';
            case LogLevel.FATAL: return 'fatal';
            default: return 'info';
        }
    }

    #buildLogPayload(messages: unknown[]): { message: string; meta?: unknown } {
        const messageParts: string[] = [];
        const metaParts: unknown[] = [];

        for (const msg of messages) {
            if (msg instanceof Error) {
                metaParts.push({
                    name: msg.name,
                    message: msg.message,
                    stack: msg.stack,
                });
                continue;
            }

            if (typeof msg === 'object' && msg != null) {
                metaParts.push(msg);
                continue;
            }

            messageParts.push(String(msg));
        }

        const message = messageParts.join(' ');
        const meta = metaParts.length ? (metaParts.length === 1 ? metaParts[0] : metaParts) : undefined;
        return { message, meta };
    }

    trace(...messages: unknown[]) {
        this.log(LogLevel.TRACE, ...messages);
    }

    debug(...messages: unknown[]) {
        this.log(LogLevel.DEBUG, ...messages);
    }

    info(...messages: unknown[]) {
        this.log(LogLevel.INFO, ...messages);
    }

    warn(...messages: unknown[]) {
        this.log(LogLevel.WARN, ...messages);
    }

    error(...messages: unknown[]) {
        this.log(LogLevel.ERROR, ...messages);
    }

    fatal(...messages: unknown[]) {
        this.log(LogLevel.FATAL, ...messages);
    }

    log(level: LogLevel, ...messages: unknown[]) {
        if (this.#closed || this.#level > level) return;

        const { message, meta } = this.#buildLogPayload(messages);
        this.#logger.log({
            level: this.#getLogLevelName(level),
            message,
            meta,
        });
    }

    close() {
        if (this.#closed) return;

        this.info('Log closed');
        this.#logger.close();
        this.#closed = true;
    }
}

export default AfronLogger;
