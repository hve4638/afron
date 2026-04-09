import * as path from 'node:path';
import { updateRegistry } from '@/runtime';
import type { AfronEnv } from '@/runtime/types';

import { ACStorage, IACStorage, JSONType, MemACStorage, StorageAccess } from 'ac-storage';

import {
    Profiles,
    MasterKeyManager, MockMasterKeyManager,
    LevelLogger
} from '@afron/core';
import ProgramPath from '@/features/program-path';

type InitRegistryProps = {
    programPath: ProgramPath;
    logger: LevelLogger;
    env: AfronEnv;
}

/**
 * 환경 설정을 반영해 스토리지와 보안 구성 요소를 초기화
 */
export async function initRegistryWithEnv({ programPath, logger, env }: InitRegistryProps) {
    let globalStorage: IACStorage;
    let masterKeyManager: MasterKeyManager;

    if (env.inMemory) {
        logger.debug(`IN MEMORY STORAGE`);
        globalStorage = new MemACStorage();
        masterKeyManager = new MockMasterKeyManager();
    }
    else {
        globalStorage = new ACStorage(programPath.basePath);
        masterKeyManager = new MasterKeyManager(path.join(programPath.basePath, 'unique'), logger);
    }

    globalStorage.register({
        'profiles': StorageAccess.Custom('profiles'),
        'config.json': StorageAccess.JSON({
            'shared_mode': JSONType.Bool().default_value(false),
        }),
        'cache.json': StorageAccess.JSON({}),
    });
    globalStorage.addAccessEvent('profiles', {
        async init(actualPath) {
            return await Profiles.From(actualPath, { masterKeyGetter: masterKeyManager });
        },
        async save(ac) {
            await ac.saveAll();
        }
    });

    const profiles = await globalStorage.access('profiles', 'profiles') as Profiles;
    if (!(masterKeyManager instanceof MasterKeyManager)) {
        logger.error('Initialization failed : masterKeyManager');
        throw new Error('Initialization failed : masterKeyManager');
    }
    if (!(profiles instanceof Profiles)) {
        logger.error('Initialization failed : profiles');
        throw new Error('Initialization failed : profiles');
    }

    updateRegistry({
        profiles,
        globalStorage,
        masterKeyManager,
    });
}
