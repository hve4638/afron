import { LevelLogger } from '@/types';

class NoLogger implements LevelLogger {
    static instance: NoLogger = new NoLogger();

    private constructor() {}

    get instanceId(): string {
        return 'no-logger';
    }

    trace(...messages: unknown[]) {}
    debug(...messages: unknown[]) {}
    info(...messages: unknown[]) {}
    warn(...messages: unknown[]) {}
    error(...messages: unknown[]) {}
    fatal(...messages: unknown[]) {}
    close() {}

}

export default NoLogger;