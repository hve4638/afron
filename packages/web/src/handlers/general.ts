import { FastifyInstance } from 'fastify';
import runtime from '@/runtime';
import ThrottleAction from '@/features/throttle-action';
import { ChatAIModels } from '@afron/chatai-models';
import { route } from '@/utils/route';

export default async function(app: FastifyInstance) {
    const throttle = ThrottleAction.getInstance();

    app.post('/api/echo', route(async (_params, body) => {
        return body.message;
    }));

    app.get('/api/version', route(async () => {
        return runtime.version;
    }));

    app.get('/api/version/available', route(async (_params, _body, query) => {
        const prerelease = query['prerelease'] === 'true';
        let ver;
        if (prerelease) {
            ver = await runtime.appVersionManager.getLatestBeta();
        }
        else {
            ver = await runtime.appVersionManager.getLatestStable();
        }

        if (ver && runtime.appVersionManager.isNewerVersion(ver.semver)) {
            return ver;
        }
        else {
            throw new Error('Failed to fetch version information');
        }
    }));

    app.get('/api/models', route(async () => {
        return ChatAIModels.categories();
    }));

    app.get('/api/legacy/exists', route(async () => {
        return runtime.migrationService.existsLegacyData();
    }));

    app.post('/api/legacy/migrate', route(async () => {
        const legacyData = await runtime.migrationService.extract();
        if (!legacyData) {
            throw new Error('No legacy data found');
        }
        await runtime.migrationService.migrate(runtime.profiles, legacyData);
        throttle.saveProfiles();
    }));

    app.post('/api/legacy/ignore', route(async () => {
        runtime.migrationService.setMigrated();
    }));
}
