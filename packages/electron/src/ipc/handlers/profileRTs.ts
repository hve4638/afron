import * as utils from '@utils';
import { IPCInvokerName } from 'types';

import runtime from '@/runtime';
import { type Profile } from '@afron/core';
import { RTExportProcess } from '@/features/event-process';
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
        /*  */
        async generateId(profileId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rtId = await profile.generateRTId();

            return [null, rtId] as const;
        },

        /* 트리 */
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

        /* RT 컨트롤 */
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
            const rtImportProcess = runtime.eventProcess.RTImportProcess();
            rtImportProcess.process(token, profileId);

            return [null] as const;
        },
        async exportFile(token: string, profileId: string, rtId: string) {
            const rtExportProcess = runtime.eventProcess.RTExportProcess();
            rtExportProcess.process(token, profileId, rtId);

            return [null] as const;
        }
    }
}

export default handler;