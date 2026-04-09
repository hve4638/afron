import runtime from '@/runtime';
import ThrottleAction from '@/features/throttle-action';
import { IPCInvokers } from '@afron/types';

function handler(): IPCInvokers.Profiles {
    const throttle = ThrottleAction.getInstance();

    return {
        async create() {
            const identifier = await runtime.profiles.createProfile();
            throttle.saveProfiles();
            return [null, identifier] as const;
        },
        async delete(profileName: string) {
            await runtime.profiles.deleteProfile(profileName);
            return [null] as const;
        },
        async getIds() {
            const ids = runtime.profiles.getProfileIDs();
            return [null, ids] as const;
        },
        async getLast() {
            const [err, profile] = await runtime.globalStorage.accessAsJSON('cache.json').then(ac => {
                return [null, ac.getOne('last_profile')] as const;
            }).catch(e => [e] as const);
            if (err) return [null, null] as const;
            return [null, profile] as const;
        },
        async setLast(id: string | null) {
            const ac = await runtime.globalStorage.accessAsJSON('cache.json');
            ac.set({ last_profile: id });
            return [null] as const;
        },
        async getOrphanIds() {
            const ids = await runtime.profiles.getOrphanProfileIds();
            return [null, ids] as const;
        },
        async recoverOrphan(profileId: string) {
            await runtime.profiles.recoverOrphanProfile(profileId);
            return [null] as const;
        }
    }
}

export default handler;
