import { initIPC } from '@/ipc'

import { initPath } from './initPath'
import { initAfronEnv } from './initAfronEnv'
import { initRegistry, initRegistryPriority } from './initRegistry'
import { initRegistryWithEnv } from './initRegistryWithEnv';
import { initDevOptions } from './initDevOptions'

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

    const { logger } = await initRegistryPriority({ programPath });
    await initRegistry({ logger });
    await initRegistryWithEnv({ programPath, logger, env });

    initIPC();
    await initDevOptions();
}

export default initialize;