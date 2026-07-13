type LogMethod = (...message: unknown[]) => void;

export interface LevelLogger {
    get instanceId(): string;

    error: LogMethod;
    warn: LogMethod;
    info: LogMethod;
    debug: LogMethod;
    trace: LogMethod;
}