import { app } from 'electron';

import { formatDateLocal } from '@/utils';
import runtime, { updateRegistry } from '@/runtime';

import {
    RTWorker,
    AppVersionManager,

    Logger,
    LogLevel,
    LevelLogger,
} from '@afron/core';
import MigrationAIFront from '@/features/migration-service';
import ProgramPath from '@/features/program-path';
import EventProcess from '@/features/event-process/EventProcess';

interface InitRegistryPriorityProps {
    programPath: ProgramPath;
}

export async function initRegistryPriority({ programPath }: InitRegistryPriorityProps) {
    // logger 초기화 및 등록
    const logLevel = (
        (app.isPackaged) ? LogLevel.INFO
            : (runtime.env.logTrace) ? LogLevel.TRACE :
                LogLevel.DEBUG
    )
    const logger = new Logger(
        programPath.logPath,
        {
            verbose: runtime.env.logVerbose,
            level: logLevel,
        },
    );

    updateRegistry({ logger });

    return {
        logger,
    }
}


interface InitRegistryProps {
    logger: LevelLogger;
}

export async function initRegistry({ logger }: InitRegistryProps) {
    const version = app.isPackaged ? app.getVersion() : `dev-${formatDateLocal()}`;

    updateRegistry({
        rtWorker: new RTWorker([]),
        eventProcess: new EventProcess(logger),
        appVersionManager: new AppVersionManager(version),
        migrationService: new MigrationAIFront(),
        version,
    });
}