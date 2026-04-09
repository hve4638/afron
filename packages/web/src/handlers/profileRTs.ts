import * as utils from '@/utils';

import runtime from '@/runtime';
import { type Profile } from '@afron/core';
import { IPCInvokers, RTMetadata } from '@afron/types';

function handler(): IPCInvokers.ProfileRTs {
    const throttles = {};

    const saveProfile = (profile: Profile) => {
        const throttleId = `profile_${profile.path}`;
        throttles[throttleId] ??= utils.throttle(500);
        throttles[throttleId](() => {
            profile.commit();
        });
    }

    return {
        async generateId(profileId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rtId = await profile.generateRTId();

            return [null, rtId] as const;
        },

        async getTree(profileId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const tree = await profile.getRTTree();

            return [null, tree] as const;
        },
        async updateTree(profileId: string, tree: any) {
            const profile = await runtime.profiles.getProfile(profileId);
            profile.updateRTTree(tree);
            saveProfile(profile);

            return [null] as const;
        },

        async createUsingTemplate(profileId: string, rtMetadata: RTMetadata, templateId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            await profile.createUsingTemplate(rtMetadata, templateId);

            return [null] as const;
        },
        async add(profileId: string, metadata: RTMetadata) {
            const profile = await runtime.profiles.getProfile(profileId);
            await profile.addRT(metadata);
            saveProfile(profile);

            return [null] as const;
        },
        async remove(profileId: string, promptId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            profile.removeRT(promptId);
            saveProfile(profile);

            return [null] as const;
        },

        async existsId(profileId: string, rtId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const exists = await profile.hasRTId(rtId);

            return [null, exists] as const;
        },
        async changeId(profileId: string, oldRTId: string, newRTId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            profile.changeRTId(oldRTId, newRTId);
            saveProfile(profile);

            return [null] as const;
        },

        async importFile(token: string, profileId: string) {
            // TODO: web에서는 HTTP upload 기반으로 변경 필요
            // 현재는 stub - front에서 별도 upload 엔드포인트 사용 예정
            const rtImportProcess = runtime.eventProcess.RTImportProcess();
            return [new Error('File import via dialog is not supported in web mode. Use upload endpoint.')] as const;
        },
        async exportFile(token: string, profileId: string, rtId: string) {
            // TODO: web에서는 HTTP download 기반으로 변경 필요
            const rtExportProcess = runtime.eventProcess.RTExportProcess();
            return [new Error('File export via dialog is not supported in web mode. Use download endpoint.')] as const;
        }
    }
}

export default handler;
