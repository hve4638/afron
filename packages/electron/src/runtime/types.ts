import type { IACStorage } from 'ac-storage';
import type {
    MasterKeyManager,
    AppVersionManager,

    Profiles,
    RTWorker,
    Logger,
} from '@afron/core';
import MigrationService from '@/features/migration-service';
import EventProcess from '@/features/event-process/EventProcess';

export type RuntimeRegistry = {
    profiles: Profiles;
    globalStorage: IACStorage;
    masterKeyManager: MasterKeyManager;
    rtWorker: RTWorker;
    eventProcess: EventProcess;
    ipcFrontAPI: IPCInvokerInterface;
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
    devUrl: string,
    showDevTool: boolean,
    inMemory: boolean,
    skipMasterKeyInitialization: boolean,
    defaultProfile: boolean,
    defaultRT: boolean,
    logTrace: boolean,
    logVerbose: boolean,
}