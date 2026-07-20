import { initIPC } from '@/ipc'
import { pathDebug } from '@/utils/pathDebug'

import { initPath } from './initPath'
import { initAfronEnv } from './initAfronEnv'
import { initRegistry, initRegistryPriority } from './initRegistry'
import { initRegistryWithEnv } from './initRegistryWithEnv';
import { initDevOptions } from './initDevOptions'

/** 앱 초기화 오케스트레이션 */
async function initialize() {
    // if (!app.isPackaged) {
    //     try {
    //         fs.cpSync(path.join(programPath.basePath, 'profiles', 'profiles.json'), path.join(programPath.basePath, 'logs', `profiles-${formatDateLocal()}.json`));
    //     }
    //     catch (error) {
    //         console.warn('Failed to copy profiles.json to logs directory:', error);
    //     }
    // }
    const { programPath } = initPath();
    const { env } = initAfronEnv();
    pathDebug('initialize: initAfronEnv done');

    const {
        logger
    } = await initRegistryPriority({ programPath });
    pathDebug('initialize: initRegistryPriority done (logger created at', programPath.logPath, ')');
    await initRegistry({ logger });
    pathDebug('initialize: initRegistry done');
    await initRegistryWithEnv({ programPath, logger, env });
    pathDebug('initialize: initRegistryWithEnv done');

    initIPC();
    pathDebug('initialize: initIPC done');
    await initDevOptions();
    pathDebug('initialize: initDevOptions done');
}

export default initialize;