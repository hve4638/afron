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

    // ── HTTP helpers ──────────────────────────────────────

    private async get<T>(path: string, query?: Record<string, string>): Promise<T> {
        const url = new URL(path, this.baseUrl);
        if (query) {
            for (const [k, v] of Object.entries(query)) {
                if (v != null) url.searchParams.set(k, String(v));
            }
        }
        const res = await fetch(url.toString());
        const json = await res.json();
        if (json.error) throw new IPCError(json.error.message);
        return json.data;
    }

    private async post<T>(path: string, body?: any): Promise<T> {
        const res = await fetch(`${this.baseUrl}${path}`, {
            method: 'POST',
            ...(body !== undefined ? {
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            } : {}),
        });
        const json = await res.json();
        if (json.error) throw new IPCError(json.error.message);
        return json.data;
    }

    private async put<T>(path: string, body?: any): Promise<T> {
        const res = await fetch(`${this.baseUrl}${path}`, {
            method: 'PUT',
            ...(body !== undefined ? {
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            } : {}),
        });
        const json = await res.json();
        if (json.error) throw new IPCError(json.error.message);
        return json.data;
    }

    private async del<T>(path: string, body?: any): Promise<T> {
        const res = await fetch(`${this.baseUrl}${path}`, {
            method: 'DELETE',
            ...(body !== undefined ? {
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            } : {}),
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
            return this.get<boolean>('/api/config/hardware-acceleration');
        },
        setHardwareAccelerationEnabled: async (value: boolean): Promise<void> => {
            await this.put('/api/config/hardware-acceleration', { value });
        },
    } as const;

    // ── general ────────────────────────────────────────────

    general = {
        echo: async (message: any) => {
            return this.post<any>('/api/echo', { message });
        },
        openBrowser: async (url: string) => {
            window.open(url, '_blank');
        },
        getCurrentVersion: async () => {
            return this.get<string>('/api/version');
        },
        getAvailableVersion: async (prerelease: boolean = false) => {
            return this.get<any>('/api/version/available', { prerelease: String(prerelease) });
        },
        getChatAIModels: async () => {
            return this.get<any>('/api/models');
        },
        existsLegacyData: async () => {
            return this.get<boolean>('/api/legacy/exists');
        },
        migrateLegacyData: async () => {
            await this.post('/api/legacy/migrate');
        },
        ignoreLegacyData: async () => {
            await this.post('/api/legacy/ignore');
        },
    } as const;

    // ── masterKey ──────────────────────────────────────────

    masterKey = {
        init: async () => {
            return this.post<any>('/api/master-key/init');
        },
        reset: async (recoveryKey: string) => {
            await this.post('/api/master-key/reset', { recoveryKey });
        },
        recover: async (recoveryKey: string) => {
            return this.post<boolean>('/api/master-key/recover', { recoveryKey });
        },
    } as const;

    // ── globalStorage ──────────────────────────────────────

    globalStorage = {
        get: async (storageName: string, keys: string[]) => {
            return this.get<any>(`/api/storage/${encodeURIComponent(storageName)}`, { keys: keys.join(',') });
        },
        set: async (storageName: string, data: KeyValueInput) => {
            await this.put(`/api/storage/${encodeURIComponent(storageName)}`, { data });
        },
    } as const;

    // ── profiles ───────────────────────────────────────────

    profiles = {
        create: async () => {
            return this.post<string>('/api/profiles');
        },
        delete: async (id: string) => {
            await this.del(`/api/profiles/${encodeURIComponent(id)}`);
        },
        getIds: async () => {
            return this.get<string[]>('/api/profiles');
        },
        getLast: async () => {
            return this.get<string | null>('/api/profiles/last');
        },
        setLast: async (id: string | null) => {
            await this.put('/api/profiles/last', { id });
        },
        getOrphanIds: async () => {
            return this.get<string[]>('/api/profiles/orphans');
        },
        recoverOrphan: async (profileId: string) => {
            await this.post(`/api/profiles/orphans/${encodeURIComponent(profileId)}/recover`);
        },
    } as const;

    // ── profile ────────────────────────────────────────────

    profile = {
        getCustomModels: async (profileId: string) => {
            return this.get<CustomModel[]>(`/api/profiles/${profileId}/models`);
        },
        setCustomModel: async (profileId: string, model: CustomModel) => {
            return this.put<string>(`/api/profiles/${profileId}/models/${encodeURIComponent(model.customId)}`, { model });
        },
        removeCustomModel: async (profileId: string, customId: string) => {
            await this.del(`/api/profiles/${profileId}/models/${encodeURIComponent(customId)}`);
        },
        getGlobalModelConfig: async (profileId: string, modelId: string) => {
            return this.get<GlobalModelConfiguration>(`/api/profiles/${profileId}/models/${encodeURIComponent(modelId)}/config`);
        },
        setGlobalModelConfig: async (profileId: string, modelId: string, config: GlobalModelConfiguration) => {
            await this.put(`/api/profiles/${profileId}/models/${encodeURIComponent(modelId)}/config`, { config });
        },
    };

    // ── profileStorage ─────────────────────────────────────

    profileStorage = {
        set: async (profileId: string, accessorId: string, data: KeyValueInput) => {
            await this.put(`/api/profiles/${profileId}/storage/${encodeURIComponent(accessorId)}`, { data });
        },
        get: async (profileId: string, accessorId: string, keys: string[]) => {
            return this.get<any>(`/api/profiles/${profileId}/storage/${encodeURIComponent(accessorId)}`, { keys: keys.join(',') });
        },
        getAsText: async (profileId: string, accessorId: string): Promise<string> => {
            return this.get<string>(`/api/profiles/${profileId}/storage/${encodeURIComponent(accessorId)}/text`);
        },
        setAsText: async (profileId: string, accessorId: string, contents: string) => {
            await this.put(`/api/profiles/${profileId}/storage/${encodeURIComponent(accessorId)}/text`, { value: contents });
        },
        getAsBinary: async (profileId: string, accessorId: string): Promise<Buffer> => {
            return this.get<Buffer>(`/api/profiles/${profileId}/storage/${encodeURIComponent(accessorId)}/binary`);
        },
        setAsBinary: async (profileId: string, accessorId: string, buffer: Buffer) => {
            await this.put(`/api/profiles/${profileId}/storage/${encodeURIComponent(accessorId)}/binary`, { content: buffer });
        },
        verifyAsSecret: async (profileId: string, accessorId: string, keys: string[]) => {
            return this.post<any>(`/api/profiles/${profileId}/storage/${encodeURIComponent(accessorId)}/verify`, { keys });
        },
        setAsSecret: async (profileId: string, accessorId: string, data: KeyValueInput) => {
            await this.put(`/api/profiles/${profileId}/storage/${encodeURIComponent(accessorId)}/secret`, { data });
        },
        removeAsSecret: async (profileId: string, accessorId: string, keys: string[]) => {
            await this.del(`/api/profiles/${profileId}/storage/${encodeURIComponent(accessorId)}/secret`, { keys });
        },
    } as const;

    // ── profileSessions ────────────────────────────────────

    profileSessions = {
        getIds: async (profileId: string): Promise<string[]> => {
            return this.get<string[]>(`/api/profiles/${profileId}/sessions`);
        },
        add: async (profileId: string) => {
            return this.post<string>(`/api/profiles/${profileId}/sessions`);
        },
        remove: async (profileId: string, sessionId: string) => {
            await this.del(`/api/profiles/${profileId}/sessions/${sessionId}`);
        },
        reorder: async (profileId: string, sessions: string[]): Promise<void> => {
            await this.put(`/api/profiles/${profileId}/sessions/order`, { sessions });
        },
        undoRemoved: async (profileId: string) => {
            return this.post<string>(`/api/profiles/${profileId}/sessions/undo`);
        },
    } as const;

    // ── profileSession ─────────────────────────────────────

    profileSession = {
        getFormValues: async (profileId: string, sessionId: string, rtId: string): Promise<Record<string, any>> => {
            return this.get<Record<string, any>>(`/api/profiles/${profileId}/sessions/${sessionId}/form/${encodeURIComponent(rtId)}`);
        },
        setFormValues: async (profileId: string, sessionId: string, rtId: string, data: Record<string, any>) => {
            await this.put(`/api/profiles/${profileId}/sessions/${sessionId}/form/${encodeURIComponent(rtId)}`, { values: data });
        },
    } as const;

    // ── profileSessionStorage ──────────────────────────────

    profileSessionStorage = {
        get: async (profileId: string, sessionId: string, accessorId: string, keys: string[]) => {
            return this.get<any>(`/api/profiles/${profileId}/sessions/${sessionId}/storage/${encodeURIComponent(accessorId)}`, { keys: keys.join(',') });
        },
        set: async (profileId: string, sessionId: string, accessorId: string, data: KeyValueInput) => {
            await this.put(`/api/profiles/${profileId}/sessions/${sessionId}/storage/${encodeURIComponent(accessorId)}`, { data });
        },
        getInputFilePreviews: async (profileId: string, sessionId: string) => {
            return this.get<any>(`/api/profiles/${profileId}/sessions/${sessionId}/files`);
        },
        addInputFile: async (profileId: string, sessionId: string, filename: string, dataBase64: string) => {
            return this.post<any>(`/api/profiles/${profileId}/sessions/${sessionId}/files`, { filename, dataURI: dataBase64 });
        },
        updateInputFiles: async (profileId: string, sessionId: string, fileHashes: InputFileHash[]) => {
            return this.put<any>(`/api/profiles/${profileId}/sessions/${sessionId}/files`, { fileHashes });
        },
    } as const;

    // ── profileSessionHistory ──────────────────────────────

    profileSessionHistory = {
        get: async (profileId: string, sessionId: string, offset: number = 0, limit: number = 100, desc: boolean = false) => {
            return this.get<any>(`/api/profiles/${profileId}/sessions/${sessionId}/history`, {
                offset: String(offset), limit: String(limit), desc: String(desc),
            });
        },
        search: async (profileId: string, sessionId: string, offset: number = 0, limit: number = 100, search: HistorySearch) => {
            return this.post<any>(`/api/profiles/${profileId}/sessions/${sessionId}/history/search`, {
                offset, limit, condition: search,
            });
        },
        getMessage: async (profileId: string, sessionId: string, historyIds: number[]) => {
            return this.get<any>(`/api/profiles/${profileId}/sessions/${sessionId}/history/messages`, {
                ids: historyIds.join(','),
            });
        },
        deleteMessage: async (profileId: string, sessionId: string, historyId: number, origin: 'in' | 'out' | 'both') => {
            await this.del(`/api/profiles/${profileId}/sessions/${sessionId}/history/${historyId}/message`, { origin });
        },
        delete: async (profileId: string, sessionId: string, historyKey: number) => {
            await this.del(`/api/profiles/${profileId}/sessions/${sessionId}/history/${historyKey}`);
        },
        deleteAll: async (profileId: string, sessionId: string) => {
            await this.del(`/api/profiles/${profileId}/sessions/${sessionId}/history`);
        },
    } as const;

    // ── profileRTs ─────────────────────────────────────────

    profileRTs = {
        createUsingTemplate: async (profileId: string, metadata: RTMetadata, templateId: string): Promise<string> => {
            await this.post(`/api/profiles/${profileId}/rts/from-template`, { metadata, templateId });
            return profileId;
        },
        getTree: async (profileId: string): Promise<RTMetadataTree> => {
            return this.get<RTMetadataTree>(`/api/profiles/${profileId}/rts`);
        },
        updateTree: async (profileId: string, tree: RTMetadataTree) => {
            await this.put(`/api/profiles/${profileId}/rts`, { tree });
        },
        generateId: async (profileId: string) => {
            return this.post<string>(`/api/profiles/${profileId}/rts/generate-id`);
        },
        add: async (profileId: string, metadata: RTMetadata) => {
            await this.post(`/api/profiles/${profileId}/rts`, { metadata });
        },
        remove: async (profileId: string, rtId: string) => {
            await this.del(`/api/profiles/${profileId}/rts/${encodeURIComponent(rtId)}`);
        },
        existsId: async (profileId: string, rtId: string) => {
            return this.get<boolean>(`/api/profiles/${profileId}/rts/${encodeURIComponent(rtId)}/exists`);
        },
        changeId: async (profileId: string, oldId: string, newId: string) => {
            await this.put(`/api/profiles/${profileId}/rts/${encodeURIComponent(oldId)}/id`, { newRTId: newId });
        },
        reflectMetadata: async (profileId: string, rtId: string) => {
            await this.post(`/api/profiles/${profileId}/rts/${encodeURIComponent(rtId)}/metadata/reflect`);
        },
        importFile: async (token: string, profileId: string) => {
            throw new IPCError('Use native.uploadRTFile() for web file import');
        },
        exportFile: async (token: string, profileId: string, rtId: string) => {
            throw new IPCError('Use native.downloadRTFile() for web file export');
        },
    } as const;

    // ── profileRT ──────────────────────────────────────────

    profileRT = {
        getMetadata: async (profileId: string, rtId: string): Promise<ProfileStorage.RT.Index> => {
            return this.get<ProfileStorage.RT.Index>(`/api/profiles/${profileId}/rts/${rtId}/metadata`);
        },
        setMetadata: async (profileId: string, rtId: string, metadata: KeyValueInput) => {
            await this.put(`/api/profiles/${profileId}/rts/${rtId}/metadata`, { metadata });
        },
        reflectMetadata: async (profileId: string, rtId: string) => {
            await this.post(`/api/profiles/${profileId}/rts/${rtId}/metadata/reflect`);
        },
        getForms: async (profileId: string, rtId: string) => {
            return this.get<any>(`/api/profiles/${profileId}/rts/${rtId}/forms`);
        },
    } as const;

    // ── profileRTStorage ───────────────────────────────────

    profileRTStorage = {
        get: async (profileId: string, rtId: string, accessorId: string, keys: string[]) => {
            return this.get<any>(`/api/profiles/${profileId}/rts/${rtId}/storage/${encodeURIComponent(accessorId)}`, { keys: keys.join(',') });
        },
        set: async (profileId: string, rtId: string, accessorId: string, data: KeyValueInput) => {
            await this.put(`/api/profiles/${profileId}/rts/${rtId}/storage/${encodeURIComponent(accessorId)}`, { data });
        },
    } as const;

    // ── profileRTPrompt ────────────────────────────────────

    profileRTPrompt = {
        getMetadata: async (profileId: string, rtId: string, promptId: string): Promise<RTPromptMetadata> => {
            return this.get<RTPromptMetadata>(`/api/profiles/${profileId}/rts/${rtId}/prompts/${promptId}/metadata`);
        },
        setMetadata: async (profileId: string, rtId: string, promptId: string, metadata: RTPromptDataEditable) => {
            await this.put(`/api/profiles/${profileId}/rts/${rtId}/prompts/${promptId}/metadata`, { metadata });
        },
        getName: async (profileId: string, rtId: string, promptId: string): Promise<string> => {
            return this.get<string>(`/api/profiles/${profileId}/rts/${rtId}/prompts/${promptId}/name`);
        },
        setName: async (profileId: string, rtId: string, promptId: string, name: string) => {
            await this.put(`/api/profiles/${profileId}/rts/${rtId}/prompts/${promptId}/name`, { name });
        },
        getVariableNames: async (profileId: string, rtId: string, promptId: string): Promise<string[]> => {
            return this.get<string[]>(`/api/profiles/${profileId}/rts/${rtId}/prompts/${promptId}/variables/names`);
        },
        getVariables: async (profileId: string, rtId: string, promptId: string): Promise<RTVar[]> => {
            return this.get<RTVar[]>(`/api/profiles/${profileId}/rts/${rtId}/prompts/${promptId}/variables`);
        },
        setVariables: async (profileId: string, rtId: string, promptId: string, vars: (RTVarCreate | RTVarUpdate)[]) => {
            return this.put<string[]>(`/api/profiles/${profileId}/rts/${rtId}/prompts/${promptId}/variables`, { vars });
        },
        removeVariables: async (profileId: string, rtId: string, promptId: string, formIds: string[]) => {
            await this.del(`/api/profiles/${profileId}/rts/${rtId}/prompts/${promptId}/variables`, { varIds: formIds });
        },
        getContents: async (profileId: string, rtId: string, promptId: string): Promise<string> => {
            return this.get<string>(`/api/profiles/${profileId}/rts/${rtId}/prompts/${promptId}/contents`);
        },
        setContents: async (profileId: string, rtId: string, promptId: string, contents: string) => {
            await this.put(`/api/profiles/${profileId}/rts/${rtId}/prompts/${promptId}/contents`, { contents });
        },
    } as const;

    // ── profileRTFlow ──────────────────────────────────────

    profileRTFlow = {
        getFlowData: async (profileId: string, rtId: string): Promise<RTFlowData> => {
            return this.get<RTFlowData>(`/api/profiles/${profileId}/rts/${rtId}/flow`);
        },
        setFlowData: async (profileId: string, rtId: string, data: RTFlowData) => {
            await this.put(`/api/profiles/${profileId}/rts/${rtId}/flow`, { data });
        },
        getPrompts: async (profileId: string, rtId: string) => {
            return this.get<any>(`/api/profiles/${profileId}/rts/${rtId}/flow/prompts`);
        },
        setPrompts: async (profileId: string, rtId: string, order: ProfileStorage.RT.PromptOrder) => {
            await this.put(`/api/profiles/${profileId}/rts/${rtId}/flow/prompts`, { order });
        },
        addPrompt: async (profileId: string, rtId: string, promptId: string, promptName: string) => {
            return this.post<any>(`/api/profiles/${profileId}/rts/${rtId}/flow/prompts`, { promptId, promptName });
        },
        removePrompt: async (profileId: string, rtId: string, promptId: string) => {
            return this.del<any>(`/api/profiles/${profileId}/rts/${rtId}/flow/prompts/${promptId}`);
        },
    } as const;

    // ── request ────────────────────────────────────────────

    request = {
        requestRT: async (token: string, profileId: string, sessionId: string) => {
            await this.post('/api/request', { token, profileId, sessionId });
        },
        previewPrompt: async (token: string, profileId: string, sessionId: string) => {
            await this.post('/api/request/preview', { token, profileId, sessionId });
        },
        abort: async (token: string) => {
            await this.post('/api/request/abort', { token });
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
