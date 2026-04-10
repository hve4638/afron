import { initPath } from './initPath';
import { initAfronEnv } from './initAfronEnv';
import { initRegistryPriority, initRegistry } from './initRegistry';
import { initRegistryWithEnv } from './initRegistryWithEnv';

async function initialize() {
    const { env } = initAfronEnv();
    const { programPath } = initPath();

    const { logger } = await initRegistryPriority({ programPath });
    await initRegistry({ logger });
    await initRegistryWithEnv({ programPath, logger, env });
}

export default initialize;
