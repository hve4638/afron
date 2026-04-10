import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { formatDateLocal } from '@/utils';
import runtime, { updateRegistry } from '@/runtime';

import {
    RTWorker,
    AppVersionManager,
    Logger,
    LogLevel,
    LevelLogger,
} from '@afron/core';
import MigrationService from '@/features/migration-service';
import ProgramPath from '@/features/program-path';
import { EventProcess } from '@/features/event-process';

interface InitRegistryPriorityProps {
    programPath: ProgramPath;
}

/**
 * 로거를 우선 레지스트리에 등록
 */
export async function initRegistryPriority({ programPath }: InitRegistryPriorityProps) {
    const logLevel = runtime.env.logTrace ? LogLevel.TRACE : runtime.env.dev ? LogLevel.DEBUG : LogLevel.INFO;

    const logger = new Logger(
        programPath.logPath,
        {
            verbose: runtime.env.logVerbose,
            level: logLevel,
        },
    );

    updateRegistry({ logger });

    return { logger };
}

interface InitRegistryProps {
    logger: LevelLogger;
}

/**
 * 런타임 핵심 구성 요소를 레지스트리에 등록
 */
export async function initRegistry({ logger }: InitRegistryProps) {
    let version: string;
    try {
        const pkgPath = path.resolve(__dirname, '../../package.json');
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        version = pkg.version ?? `dev-${formatDateLocal()}`;
    }
    catch {
        version = `dev-${formatDateLocal()}`;
    }

    updateRegistry({
        rtWorker: new RTWorker([]),
        eventProcess: new EventProcess(logger),
        appVersionManager: new AppVersionManager(version),
        migrationService: new MigrationService(),
        version,
    });
}
