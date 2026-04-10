import type { IACStorage } from 'ac-storage';
import type {
    MasterKeyManager,
    AppVersionManager,
    Profiles,
    RTWorker,
    Logger,
} from '@afron/core';
import type MigrationService from '@/features/migration-service';
import type EventProcess from '@/features/event-process/EventProcess';

export type RuntimeRegistry = {
    profiles: Profiles;
    globalStorage: IACStorage;
    masterKeyManager: MasterKeyManager;
    rtWorker: RTWorker;
    eventProcess: EventProcess;
    appVersionManager: AppVersionManager;
    migrationService: MigrationService;
    logger: Logger;
    version: string;
    env: AfronEnv;
}

export type PartialRuntimeRegistry = Partial<RuntimeRegistry> & {
    env?: Partial<AfronEnv>,
}

export type AfronEnv = {
    dev: boolean,
    inMemory: boolean,
    skipMasterKeyInitialization: boolean,
    defaultProfile: boolean,
    defaultRT: boolean,
    logTrace: boolean,
    logVerbose: boolean,
    port: number,
    dataDir: string,
}
