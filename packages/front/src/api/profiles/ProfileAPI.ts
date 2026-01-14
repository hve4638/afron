import LocalAPI from '@/api/local';
import { SessionAPI } from './SessionAPI';
import RTAPI from './RTAPI';
import { CustomModel, KeyValueInput, RTFlowData, RTMetadata, RTMetadataTree } from '@afron/types';

class ProfileAPI {
    #profileId: string;
    #sessionAPIs: Record<string, SessionAPI> = {};
    #rtAPIs: Record<string, RTAPI> = {};

    constructor(id: string) {
        this.#profileId = id;
    }

    static getMock() {
        const source = new ProfileAPI('--mock');
        const mock = {};
        const proto = Object.getPrototypeOf(source);
        Object.getOwnPropertyNames(proto).forEach(key => {
            if (key !== 'constructor' && typeof source[key] === 'function') {
                mock[key] = (...args: unknown[]) => undefined;
            }
        });
        mock['isMock'] = () => true;

        return mock as ProfileAPI;
    }

    get id() {
        return this.#profileId;
    }

    isMock() {
        return false;
    }

    set = async (accessorId: string, data: KeyValueInput) => await LocalAPI.profileStorage.set(this.#profileId, accessorId, data);
    get = async (accessorId: string, keys: string[]) => await LocalAPI.profileStorage.get(this.#profileId, accessorId, keys);
    getAsText = async (accessorId: string): Promise<string> => await LocalAPI.profileStorage.getAsText(this.#profileId, accessorId);
    setAsText = async (accessorId: string, contents: string) => await LocalAPI.profileStorage.setAsText(this.#profileId, accessorId, contents);
    getAsBinary = async (accessorId: string): Promise<Buffer> => await LocalAPI.profileStorage.getAsBinary(this.#profileId, accessorId);
    setAsBinary = async (accessorId: string, buffer: Buffer) => await LocalAPI.profileStorage.setAsBinary(this.#profileId, accessorId, buffer);
    verifyAsSecret = async (accessorId: string, keys: string[]) => await LocalAPI.profileStorage.verifyAsSecret(this.#profileId, accessorId, keys);
    setAsSecret = async (accessorId: string, data: KeyValueInput) => await LocalAPI.profileStorage.setAsSecret(this.#profileId, accessorId, data);
    removeAsSecret = async (accessorId: string, keys: string[]) => await LocalAPI.profileStorage.removeAsSecret(this.#profileId, accessorId, keys);

    storage = {
        /** @deprecated use `verifyAsSecret` instead */
        hasSecret: async (accessorId: string, keys: string[]) => await LocalAPI.profileStorage.verifyAsSecret(this.#profileId, accessorId, keys),
        /** @deprecated use `setAsSecret` instead */
        setSecret: async (accessorId: string, data: KeyValueInput) => await LocalAPI.profileStorage.setAsSecret(this.#profileId, accessorId, data),
        /** @deprecated use `removeAsSecret` instead */
        removeSecret: async (accessorId: string, keys: string[]) => await LocalAPI.profileStorage.removeAsSecret(this.#profileId, accessorId, keys),
    } as const;
    sessions = {
        getIds: async () => await LocalAPI.profileSessions.getIds(this.#profileId),
        add: async () => await LocalAPI.profileSessions.add(this.#profileId),
        remove: async (sessionId: string) => await LocalAPI.profileSessions.remove(this.#profileId, sessionId),
        reorder: async (sessions: string[]) => await LocalAPI.profileSessions.reorder(this.#profileId, sessions),
        undoRemoved: async () => await LocalAPI.profileSessions.undoRemoved(this.#profileId),

        /** @deprecated use `add` instead */
        create: async () => await LocalAPI.profileSessions.add(this.#profileId),
    } as const;
    rts = {
        getTree: async () => LocalAPI.profileRTs.getTree(this.#profileId),
        updateTree: async (tree: RTMetadataTree) => LocalAPI.profileRTs.updateTree(this.#profileId, tree),
        generateId: async () => LocalAPI.profileRTs.generateId(this.#profileId),
        createRTUsingTemplate: async (metadata: RTMetadata, templateId: string) => LocalAPI.profileRTs.createUsingTemplate(this.#profileId, metadata, templateId),
        add: async (metadata: RTMetadata) => LocalAPI.profileRTs.add(this.#profileId, metadata),
        remove: async (rtId: string) => LocalAPI.profileRTs.remove(this.#profileId, rtId),
        existsId: async (rtId: string) => LocalAPI.profileRTs.existsId(this.#profileId, rtId),
        changeId: async (oldId: string, newId: string) => LocalAPI.profileRTs.changeId(this.#profileId, oldId, newId),

        /** @deprecated use `existsId` instead */
        hasId: async (rtId: string) => LocalAPI.profileRTs.existsId(this.#profileId, rtId),
    } as const;
    workflow = {
        getFlowData: async (rtId: string) => await LocalAPI.profileRTFlow.getFlowData(this.#profileId, rtId),
        setFlowData: async (rtId: string, flowData: RTFlowData) => await LocalAPI.profileRTFlow.setFlowData(this.#profileId, rtId, flowData),
    }
    customModels = {
        getAll: async () => await LocalAPI.profile.getCustomModels(this.#profileId),
        set: async (model: CustomModel) => await LocalAPI.profile.setCustomModel(this.#profileId, model),
        remove: async (customId: string) => await LocalAPI.profile.removeCustomModel(this.#profileId, customId),
    } as const;
    globalModelConfig = {
        get: async (modelId: string) => await LocalAPI.profile.getGlobalModelConfig(this.#profileId, modelId),
        set: async (modelId: string, config: Record<string, any>) => await LocalAPI.profile.setGlobalModelConfig(this.#profileId, modelId, config),
    } as const;

    session(sessionId: string): SessionAPI {
        if (!(sessionId in this.#sessionAPIs)) {
            this.#sessionAPIs[sessionId] = new SessionAPI(this.#profileId, sessionId);
        }
        return this.#sessionAPIs[sessionId] as SessionAPI;
    }
    rt(rtId: string): RTAPI {
        if (!(rtId in this.#rtAPIs)) {
            this.#rtAPIs[rtId] = new RTAPI(this.#profileId, rtId);
        }
        return this.#rtAPIs[rtId] as RTAPI;
    }

    /** @deprecated use `session` instead */
    getSessionAPI(sessionId: string): SessionAPI {
        console.warn('ProfileAPI.getSessionAPI is deprecated. Use ProfileAPI.session instead.');
        if (!(sessionId in this.#sessionAPIs)) {
            this.#sessionAPIs[sessionId] = new SessionAPI(this.#profileId, sessionId);
        }
        return this.#sessionAPIs[sessionId] as SessionAPI;
    }
    /** @deprecated use `rt` instead */
    getRTAPI(rtId: string): RTAPI {
        console.warn('ProfileAPI.getRTAPI is deprecated. Use ProfileAPI.rt instead.');
        if (!(rtId in this.#rtAPIs)) {
            this.#rtAPIs[rtId] = new RTAPI(this.#profileId, rtId);
        }
        return this.#rtAPIs[rtId] as RTAPI;
    }
}


export default ProfileAPI;