import runtime from '@/runtime';
import ThrottleAction from '@/features/throttle-action';
import { ChatAIModels } from '@afron/chatai-models'
import { IPCInvokers, VersionInfo } from '@afron/types';

function general(): IPCInvokers.General {
    const throttle = ThrottleAction.getInstance();

    return {
        async echo(message: string) {
            return [null, message];
        },
        async openBrowser(_url: string) {
            // web에서는 no-op (front에서 window.open 처리)
            return [null];
        },
        async getCurrentVersion() {
            return [null, runtime.version];
        },
        async getAvailableVersion(prerelease: boolean) {
            let ver: VersionInfo | null;
            if (prerelease) {
                ver = await runtime.appVersionManager.getLatestBeta();
            }
            else {
                ver = await runtime.appVersionManager.getLatestStable();
            }

            if (ver && runtime.appVersionManager.isNewerVersion(ver.semver)) {
                return [null, ver];
            }
            else {
                return [new Error('Failed to fetch version information')];
            }
        },
        async getChatAIModels() {
            return [null, ChatAIModels.categories()];
        },

        async existsLegacyData() {
            return [null, runtime.migrationService.existsLegacyData()];
        },
        async migrateLegacyData() {
            const legacyData = await runtime.migrationService.extract();
            if (!legacyData) {
                return [new Error('No legacy data found')];
            }
            await runtime.migrationService.migrate(runtime.profiles, legacyData);
            throttle.saveProfiles();

            return [null];
        },
        async ignoreLegacyData() {
            runtime.migrationService.setMigrated();
            return [null];
        }
    }
}

export default general;
