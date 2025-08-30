import { app } from 'electron';

import { formatDateLocal } from '@/utils';
import runtime, { updateRegistry } from '@/runtime';

import {
    RTWorker,
    AppVersionManager,
    
    Logger,
    LogLevel,
} from '@afron/core';
// import RTWorker from '@/features/rt-worker';
// import AppVersionManager from '@/features/app-version';
// import Logger, { LogLevel } from '@/features/logger';
import MigrationAIFront from '@/features/migration-service';
import ProgramPath from '@/features/program-path';
import EventProcess from '@/features/event-process/EventProcess';

type InitRegistryProps = {
    programPath: ProgramPath;
}

export async function initRegistry({ programPath }: InitRegistryProps) {
    const version = app.isPackaged ? app.getVersion() : `dev-${formatDateLocal()}`;

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

    // 이후 registry 업데이트 시 runtime에서 접근해 참조하는 경우가 있을 수 있으므로 우선 초기화
    // @TODO: 과거 구현 방식의 호환성을 위함으로 해결시 통합 필요
    updateRegistry({ logger });

    updateRegistry({
        rtWorker: new RTWorker([]),
        eventProcess: new EventProcess(logger),
        appVersionManager: new AppVersionManager(version),
        migrationService: new MigrationAIFront(),
        version,
    });
}