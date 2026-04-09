import { IPCError } from 'api/error';
import { IIPCAPI } from '../types';
import { CustomModel, GlobalModelConfiguration, HistorySearch, InputFileHash, KeyValueInput, ProfileStorage, RTFlowData, RTMetadata, RTMetadataTree, RTPromptDataEditable, RTPromptMetadata, RTVar, RTVarCreate, RTVarUpdate } from '@afron/types';

class WebHTTPAPI implements IIPCAPI {
    static instance: WebHTTPAPI | null = null;

    static getInstance() {
        WebHTTPAPI.instance ??= new WebHTTPAPI();
        return WebHTTPAPI.instance;
    }

    private baseUrl: string;
    #ws: WebSocket | null = null;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    #listeners = new Map<number, { channel: string, callback: Function }>();
    #nextBindId = 1;

    private constructor() {
        this.baseUrl = window.location.origin;
    }

    private async call<T>(category: string, method: string, ...args: any[]): Promise<T> {
        const res = await fetch(`${this.baseUrl}/api/${category}/${method}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ args }),
        });
        const json = await res.json();
        if (json.error) throw new IPCError(json.error.message);
        return json.data;
    }

    // ── WebSocket ──────────────────────────────────────────

    private connectWs() {
        if (this.#ws && (this.#ws.readyState === WebSocket.OPEN || this.#ws.readyState === WebSocket.CONNECTING)) return;

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        this.#ws = new WebSocket(`${protocol}//${window.location.host}/ws`);

        this.#ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            for (const [, entry] of this.#listeners) {
                if (entry.channel === msg.channel) {
                    entry.callback(null, msg.chId, msg.data);
                }
            }
        };

        this.#ws.onclose = () => {
            this.#ws = null;
            setTimeout(() => {
                if (this.#listeners.size > 0) this.connectWs();
            }, 1000);
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    private addWsListener(channel: string, callback: Function): number {
        this.connectWs();
        const bindId = this.#nextBindId++;
        this.#listeners.set(bindId, { channel, callback });
        return bindId;
    }

    private removeWsListener(bindId: number): void {
        this.#listeners.delete(bindId);
    }

    // ── Deprecated listeners ───────────────────────────────

    async addRequestListener(listener: any) {
        return this.addWsListener('request', listener);
    }

    async removeRequestListener(bindId: any) {
        this.removeWsListener(bindId);
    }

    // ── globalConfig ───────────────────────────────────────

    globalConfig = {
        getHardwareAccelerationEnabled: async (): Promise<boolean> => {
            return false;
        },
        setHardwareAccelerationEnabled: async (_value: boolean): Promise<void> => {
            // no-op for web
        },
    } as const;

    // ── general ────────────────────────────────────────────

    general = {
        echo: async (message: any) => {
            return this.call<any>('general', 'echo', message);
        },
        openBrowser: async (url: string) => {
            window.open(url, '_blank');
        },
        getCurrentVersion: async () => {
            return this.call<string>('general', 'getCurrentVersion');
        },
        getAvailableVersion: async (prerelease: boolean = false) => {
            return this.call<any>('general', 'getAvailableVersion', prerelease);
        },
        getChatAIModels: async () => {
            return this.call<any>('general', 'getChatAIModels');
        },
        existsLegacyData: async () => {
            return this.call<boolean>('general', 'existsLegacyData');
        },
        migrateLegacyData: async () => {
            return this.call<void>('general', 'migrateLegacyData');
        },
        ignoreLegacyData: async () => {
            return this.call<void>('general', 'ignoreLegacyData');
        },
    } as const;

    // ── masterKey ──────────────────────────────────────────

    masterKey = {
        init: async () => {
            return this.call<any>('masterKey', 'init');
        },
        reset: async (recoveryKey: string) => {
            return this.call<void>('masterKey', 'reset', recoveryKey);
        },
        recover: async (recoveryKey: string) => {
            return this.call<boolean>('masterKey', 'recover', recoveryKey);
        },
    } as const;

    // ── globalStorage ──────────────────────────────────────

    globalStorage = {
        get: async (storageName: string, keys: string[]) => {
            return this.call<any>('globalStorage', 'get', storageName, keys);
        },
        set: async (storageName: string, data: KeyValueInput) => {
            return this.call<void>('globalStorage', 'set', storageName, data);
        },
    } as const;

    // ── profiles ───────────────────────────────────────────

    profiles = {
        create: async () => {
            return this.call<string>('profiles', 'create');
        },
        delete: async (id: string) => {
            return this.call<void>('profiles', 'delete', id);
        },
        getIds: async () => {
            return this.call<string[]>('profiles', 'getIds');
        },
        getLast: async () => {
            return this.call<string | null>('profiles', 'getLast');
        },
        setLast: async (id: string | null) => {
            return this.call<void>('profiles', 'setLast', id);
        },
        getOrphanIds: async () => {
            return this.call<string[]>('profiles', 'getOrphanIds');
        },
        recoverOrphan: async (profileId: string) => {
            return this.call<void>('profiles', 'recoverOrphan', profileId);
        },
    } as const;

    // ── profile ────────────────────────────────────────────

    profile = {
        getCustomModels: async (profileId: string) => {
            return this.call<CustomModel[]>('profile', 'getCustomModels', profileId);
        },
        setCustomModel: async (profileId: string, model: CustomModel) => {
            return this.call<string>('profile', 'setCustomModel', profileId, model);
        },
        removeCustomModel: async (profileId: string, customId: string) => {
            return this.call<void>('profile', 'removeCustomModel', profileId, customId);
        },
        getGlobalModelConfig: async (profileId: string, modelId: string) => {
            return this.call<GlobalModelConfiguration>('profile', 'getGlobalModelConfig', profileId, modelId);
        },
        setGlobalModelConfig: async (profileId: string, modelId: string, config: GlobalModelConfiguration) => {
            return this.call<void>('profile', 'setGlobalModelConfig', profileId, modelId, config);
        },
    };

    // ── profileStorage ─────────────────────────────────────

    profileStorage = {
        set: async (profileId: string, accessorId: string, data: KeyValueInput) => {
            return this.call<void>('profileStorage', 'set', profileId, accessorId, data);
        },
        get: async (profileId: string, accessorId: string, keys: string[]) => {
            return this.call<any>('profileStorage', 'get', profileId, accessorId, keys);
        },
        getAsText: async (profileId: string, accessorId: string): Promise<string> => {
            return this.call<string>('profileStorage', 'getAsText', profileId, accessorId);
        },
        setAsText: async (profileId: string, accessorId: string, contents: string) => {
            return this.call<void>('profileStorage', 'setAsText', profileId, accessorId, contents);
        },
        getAsBinary: async (profileId: string, accessorId: string): Promise<Buffer> => {
            return this.call<Buffer>('profileStorage', 'getAsBinary', profileId, accessorId);
        },
        setAsBinary: async (profileId: string, accessorId: string, buffer: Buffer) => {
            return this.call<void>('profileStorage', 'setAsBinary', profileId, accessorId, buffer);
        },
        verifyAsSecret: async (profileId: string, accessorId: string, keys: string[]) => {
            return this.call<any>('profileStorage', 'verifyAsSecret', profileId, accessorId, keys);
        },
        setAsSecret: async (profileId: string, accessorId: string, data: KeyValueInput) => {
            return this.call<void>('profileStorage', 'setAsSecret', profileId, accessorId, data);
        },
        removeAsSecret: async (profileId: string, accessorId: string, keys: string[]) => {
            return this.call<void>('profileStorage', 'removeAsSecret', profileId, accessorId, keys);
        },
    } as const;

    // ── profileSessions ────────────────────────────────────

    profileSessions = {
        getIds: async (profileId: string): Promise<string[]> => {
            return this.call<string[]>('profileSessions', 'getIds', profileId);
        },
        add: async (profileId: string) => {
            return this.call<string>('profileSessions', 'add', profileId);
        },
        remove: async (profileId: string, sessionId: string) => {
            return this.call<void>('profileSessions', 'remove', profileId, sessionId);
        },
        reorder: async (profileId: string, sessions: string[]): Promise<void> => {
            return this.call<void>('profileSessions', 'reorder', profileId, sessions);
        },
        undoRemoved: async (profileId: string) => {
            return this.call<string>('profileSessions', 'undoRemoved', profileId);
        },
    } as const;

    // ── profileSession ─────────────────────────────────────

    profileSession = {
        getFormValues: async (profileId: string, sessionId: string, rtId: string): Promise<Record<string, any>> => {
            return this.call<Record<string, any>>('profileSession', 'getFormValues', profileId, sessionId, rtId);
        },
        setFormValues: async (profileId: string, sessionId: string, rtId: string, data: Record<string, any>) => {
            return this.call<void>('profileSession', 'setFormValues', profileId, sessionId, rtId, data);
        },
    } as const;

    // ── profileSessionStorage ──────────────────────────────

    profileSessionStorage = {
        get: async (profileId: string, sessionId: string, accessorId: string, keys: string[]) => {
            return this.call<any>('profileSessionStorage', 'get', profileId, sessionId, accessorId, keys);
        },
        set: async (profileId: string, sessionId: string, accessorId: string, data: KeyValueInput) => {
            return this.call<void>('profileSessionStorage', 'set', profileId, sessionId, accessorId, data);
        },
        getInputFilePreviews: async (profileId: string, sessionId: string) => {
            return this.call<any>('profileSessionStorage', 'getInputFilePreviews', profileId, sessionId);
        },
        addInputFile: async (profileId: string, sessionId: string, filename: string, dataBase64: string) => {
            return this.call<any>('profileSessionStorage', 'addInputFile', profileId, sessionId, filename, dataBase64);
        },
        updateInputFiles: async (profileId: string, sessionId: string, fileHashes: InputFileHash[]) => {
            return this.call<any>('profileSessionStorage', 'updateInputFiles', profileId, sessionId, fileHashes);
        },
    } as const;

    // ── profileSessionHistory ──────────────────────────────

    profileSessionHistory = {
        get: async (profileId: string, sessionId: string, offset: number = 0, limit: number = 100, desc: boolean = false) => {
            return this.call<any>('profileSessionHistory', 'get', profileId, sessionId, offset, limit, desc);
        },
        search: async (profileId: string, sessionId: string, offset: number = 0, limit: number = 100, search: HistorySearch) => {
            return this.call<any>('profileSessionHistory', 'search', profileId, sessionId, offset, limit, search);
        },
        getMessage: async (profileId: string, sessionId: string, historyIds: number[]) => {
            return this.call<any>('profileSessionHistory', 'getMessage', profileId, sessionId, historyIds);
        },
        deleteMessage: async (profileId: string, sessionId: string, historyId: number, origin: 'in' | 'out' | 'both') => {
            return this.call<void>('profileSessionHistory', 'deleteMessage', profileId, sessionId, historyId, origin);
        },
        delete: async (profileId: string, sessionId: string, historyKey: number) => {
            return this.call<void>('profileSessionHistory', 'delete', profileId, sessionId, historyKey);
        },
        deleteAll: async (profileId: string, sessionId: string) => {
            return this.call<void>('profileSessionHistory', 'deleteAll', profileId, sessionId);
        },
    } as const;

    // ── profileRTs ─────────────────────────────────────────

    profileRTs = {
        createUsingTemplate: async (profileId: string, metadata: RTMetadata, templateId: string): Promise<string> => {
            await this.call<void>('profileRTs', 'createUsingTemplate', profileId, metadata, templateId);
            return profileId;
        },
        getTree: async (profileId: string): Promise<RTMetadataTree> => {
            return this.call<RTMetadataTree>('profileRTs', 'getTree', profileId);
        },
        updateTree: async (profileId: string, tree: RTMetadataTree) => {
            return this.call<void>('profileRTs', 'updateTree', profileId, tree);
        },
        generateId: async (profileId: string) => {
            return this.call<string>('profileRTs', 'generateId', profileId);
        },
        add: async (profileId: string, metadata: RTMetadata) => {
            return this.call<void>('profileRTs', 'add', profileId, metadata);
        },
        remove: async (profileId: string, rtId: string) => {
            return this.call<void>('profileRTs', 'remove', profileId, rtId);
        },
        existsId: async (profileId: string, rtId: string) => {
            return this.call<boolean>('profileRTs', 'existsId', profileId, rtId);
        },
        changeId: async (profileId: string, oldId: string, newId: string) => {
            return this.call<void>('profileRTs', 'changeId', profileId, oldId, newId);
        },
        reflectMetadata: async (profileId: string, rtId: string) => {
            return this.call<void>('profileRTs', 'reflectMetadata', profileId, rtId);
        },
        importFile: async (token: string, profileId: string) => {
            return this.call<void>('profileRTs', 'importFile', token, profileId);
        },
        exportFile: async (token: string, profileId: string, rtId: string) => {
            return this.call<void>('profileRTs', 'exportFile', token, profileId, rtId);
        },
    } as const;

    // ── profileRT ──────────────────────────────────────────

    profileRT = {
        getMetadata: async (profileId: string, rtId: string): Promise<ProfileStorage.RT.Index> => {
            return this.call<ProfileStorage.RT.Index>('profileRT', 'getMetadata', profileId, rtId);
        },
        setMetadata: async (profileId: string, rtId: string, metadata: KeyValueInput) => {
            return this.call<void>('profileRT', 'setMetadata', profileId, rtId, metadata);
        },
        reflectMetadata: async (profileId: string, rtId: string) => {
            return this.call<void>('profileRT', 'reflectMetadata', profileId, rtId);
        },
        getForms: async (profileId: string, rtId: string) => {
            return this.call<any>('profileRT', 'getForms', profileId, rtId);
        },
    } as const;

    // ── profileRTStorage ───────────────────────────────────

    profileRTStorage = {
        get: async (profileId: string, rtId: string, accessorId: string, keys: string[]) => {
            return this.call<any>('profileRTStorage', 'get', profileId, rtId, accessorId, keys);
        },
        set: async (profileId: string, rtId: string, accessorId: string, data: KeyValueInput) => {
            return this.call<void>('profileRTStorage', 'set', profileId, rtId, accessorId, data);
        },
    } as const;

    // ── profileRTPrompt ────────────────────────────────────

    profileRTPrompt = {
        getMetadata: async (profileId: string, rtId: string, promptId: string): Promise<RTPromptMetadata> => {
            return this.call<RTPromptMetadata>('profileRTPrompt', 'getMetadata', profileId, rtId, promptId);
        },
        setMetadata: async (profileId: string, rtId: string, promptId: string, metadata: RTPromptDataEditable) => {
            return this.call<void>('profileRTPrompt', 'setMetadata', profileId, rtId, promptId, metadata);
        },
        getName: async (profileId: string, rtId: string, promptId: string): Promise<string> => {
            return this.call<string>('profileRTPrompt', 'getName', profileId, rtId, promptId);
        },
        setName: async (profileId: string, rtId: string, promptId: string, name: string) => {
            return this.call<void>('profileRTPrompt', 'setName', profileId, rtId, promptId, name);
        },
        getVariableNames: async (profileId: string, rtId: string, promptId: string): Promise<string[]> => {
            return this.call<string[]>('profileRTPrompt', 'getVariableNames', profileId, rtId, promptId);
        },
        getVariables: async (profileId: string, rtId: string, promptId: string): Promise<RTVar[]> => {
            return this.call<RTVar[]>('profileRTPrompt', 'getVariables', profileId, rtId, promptId);
        },
        setVariables: async (profileId: string, rtId: string, promptId: string, vars: (RTVarCreate | RTVarUpdate)[]) => {
            return this.call<string[]>('profileRTPrompt', 'setVariables', profileId, rtId, promptId, vars);
        },
        removeVariables: async (profileId: string, rtId: string, promptId: string, formIds: string[]) => {
            return this.call<void>('profileRTPrompt', 'removeVariables', profileId, rtId, promptId, formIds);
        },
        getContents: async (profileId: string, rtId: string, promptId: string): Promise<string> => {
            return this.call<string>('profileRTPrompt', 'getContents', profileId, rtId, promptId);
        },
        setContents: async (profileId: string, rtId: string, promptId: string, contents: string) => {
            return this.call<void>('profileRTPrompt', 'setContents', profileId, rtId, promptId, contents);
        },
    } as const;

    // ── profileRTFlow ──────────────────────────────────────

    profileRTFlow = {
        getFlowData: async (profileId: string, rtId: string): Promise<RTFlowData> => {
            return this.call<RTFlowData>('profileRTFlow', 'getFlowData', profileId, rtId);
        },
        setFlowData: async (profileId: string, rtId: string, data: RTFlowData) => {
            return this.call<void>('profileRTFlow', 'setFlowData', profileId, rtId, data);
        },
        getPrompts: async (profileId: string, rtId: string) => {
            return this.call<any>('profileRTFlow', 'getPrompts', profileId, rtId);
        },
        setPrompts: async (profileId: string, rtId: string, order: ProfileStorage.RT.PromptOrder) => {
            return this.call<void>('profileRTFlow', 'setPrompts', profileId, rtId, order);
        },
        addPrompt: async (profileId: string, rtId: string, promptId: string, promptName: string) => {
            return this.call<any>('profileRTFlow', 'addPrompt', profileId, rtId, promptId, promptName);
        },
        removePrompt: async (profileId: string, rtId: string, promptId: string) => {
            return this.call<any>('profileRTFlow', 'removePrompt', profileId, rtId, promptId);
        },
    } as const;

    // ── request ────────────────────────────────────────────

    request = {
        requestRT: async (token: string, profileId: string, sessionId: string) => {
            return this.call<void>('request', 'requestRT', token, profileId, sessionId);
        },
        previewPrompt: async (token: string, profileId: string, sessionId: string) => {
            return this.call<void>('request', 'previewPrompt', token, profileId, sessionId);
        },
        abort: async (token: string) => {
            return this.call<void>('request', 'abort', token);
        },
    } as const;

    // ── events (WebSocket) ─────────────────────────────────

    events = {
        onGlobal: async (listener: any) => {
            return this.addWsListener('global', listener);
        },
        onRequest: async (listener: any) => {
            return this.addWsListener('request', listener);
        },
        onDebug: async (listener: any) => {
            return this.addWsListener('debug', listener);
        },
        off: async (bindId: number) => {
            this.removeWsListener(bindId);
        },
    } as const;
}

export default WebHTTPAPI;
