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
import { pathDebug } from '@/utils/pathDebug';

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

    // GlobalStorage 및 MasterKeyManager 초기화
    if (env.inMemory) {
        logger.debug(`IN MEMORY STORAGE`);
        globalStorage = new MemACStorage();
        masterKeyManager = new MockMasterKeyManager();
    }
    else {
        pathDebug('initRegistryWithEnv: creating ACStorage at', programPath.basePath);
        globalStorage = new ACStorage(programPath.basePath);
        pathDebug('initRegistryWithEnv: creating MasterKeyManager at', path.join(programPath.basePath, 'unique'));
        masterKeyManager = new MasterKeyManager(path.join(programPath.basePath, 'unique'), logger);
        pathDebug('initRegistryWithEnv: ACStorage/MasterKeyManager created');
    }

    // GlobalStorage 스키마 등록
    globalStorage.register({
        'profiles': StorageAccess.Custom('profiles'),
        'config.json': StorageAccess.JSON({
            'shared_mode': JSONType.Bool().default_value(false),
            'hardware_acceleration': JSONType.Bool().default_value(true),
        }),
        'cache.json': StorageAccess.JSON({
            'lastsize': JSONType.Array(),
        }),
    });
    globalStorage.addAccessEvent('profiles', {
        async init(actualPath) {
            return await Profiles.From(actualPath, { masterKeyGetter: masterKeyManager });
        },
        async save(ac) {
            await ac.saveAll();
        }
    });

    // 검증 단계
    pathDebug('initRegistryWithEnv: accessing profiles at', programPath.profilePath);
    const profiles = await globalStorage.access('profiles', 'profiles') as Profiles;
    pathDebug('initRegistryWithEnv: profiles loaded, count =', profiles.getProfileIDs().length);
    if (!(masterKeyManager instanceof MasterKeyManager)) {
        logger.error('Initialization failed : masterKeyManager');
        logger.error('Aborting...');

        throw new Error('Initialization failed : masterKeyManager');
    }
    if (!(profiles instanceof Profiles)) {
        logger.error('Initialization failed : profiles');
        logger.error('Aborting...');

        throw new Error('Initialization failed : profiles');
    }

    updateRegistry({
        profiles,
        globalStorage,
        masterKeyManager,
    });
}