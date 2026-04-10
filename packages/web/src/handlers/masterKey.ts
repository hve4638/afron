import { FastifyInstance } from 'fastify';
import { MasterKeyInitResult } from '@afron/core';
import runtime from '@/runtime';
import { route } from '@/utils/route';

export default async function(app: FastifyInstance) {
    app.post('/api/master-key/init', route(async () => {
        const result = await runtime.masterKeyManager.init();
        switch (result) {
            case MasterKeyInitResult.InvalidData:
                runtime.logger.warn('Master key initialization failed: Invalid data');
                return 'invalid-data';
            case MasterKeyInitResult.NoData:
                runtime.logger.info('Master key initialization failed: No data');
                return 'no-data';
            case MasterKeyInitResult.NeedRecovery:
                runtime.logger.warn('Master key initialization failed: Need recovery');
                return 'need-recovery';
            case MasterKeyInitResult.Normal:
                runtime.logger.info('Master key initialized successfully');
                return 'normal';
            default:
                throw Object.assign(new Error(''), { name: 'InitializeFail', value: 'other' });
        }
    }));

    app.post('/api/master-key/reset', route(async (_params, body) => {
        runtime.logger.info(`Resetting master key`);
        await runtime.masterKeyManager.resetKey(body.recoveryKey);
    }));

    app.post('/api/master-key/recover', route(async (_params, body) => {
        runtime.logger.info(`Try to recover master key with recovery key`);
        const configAC = await runtime.globalStorage.accessAsJSON('config.json');
        const sharedMode = configAC.getOne('shared_mode');

        const success = await runtime.masterKeyManager.recoveryMasterKey(body.recoveryKey);
        if (success) {
            runtime.logger.info(`Master key recovered successfully`);

            if (sharedMode) {
                runtime.logger.info(`Binding master key as new hardware key`);
                await runtime.masterKeyManager.bindHardwareKey();
            }
            else {
                runtime.logger.info(`Rebinding master key`);
                await runtime.masterKeyManager.rebindKey(body.recoveryKey);
            }
        }
        else {
            runtime.logger.info(`Master key recovery failed`);
        }
        return success;
    }));
}
