import LocalAPI from '@/api/local';
import {
    SessionAccessorId,
    SessionAccessorSchemaMap,
    SessionAccessorInput,
    SessionAccessorResult,
} from './types';
import { HistorySearch, InputFileHash } from '@afron/types';

export class SessionAPI {
    #profileId: string;
    #sessionId: string;

    constructor(profileId: string, sessionId: string) {
        this.#profileId = profileId;
        this.#sessionId = sessionId;
    }

    get id() {
        return this.#sessionId;
    }

    /**
     * 세션 데이터 조회
     * 
     * @param accessorId - 스토리지 accessor (cache.json, config.json, data.json)
     * @param keys - 조회할 키 배열
     * @returns 요청된 키에 해당하는 데이터
     */
    async get<
        AccessorId extends SessionAccessorId,
        AccessorKey extends keyof SessionAccessorSchemaMap[AccessorId]
    >(
        accessorId: AccessorId,
        keys: AccessorKey[]
    ): Promise<SessionAccessorResult<AccessorId, AccessorKey>>;
    async get(accessorId: string, keys: string[]): Promise<Record<string, any>>;
    async get(
        accessorId: string,
        keys: string[]
    ) {
        return LocalAPI.profileSessionStorage.get(this.#profileId, this.#sessionId, accessorId, keys);
    }

    /**
     * 세션 데이터 저장
     * 
     * @param accessorId - 스토리지 accessor (cache.json, config.json, data.json)
     * @param data - 저장할 데이터
     */
    async set<AccessorId extends SessionAccessorId>(
        accessorId: AccessorId,
        data: SessionAccessorInput<AccessorId>
    ): Promise<void>;
    async set(
        accessorId: string,
        data: Record<string, any>
    ): Promise<void>;
    async set(
        accessorId: string,
        data: Record<string, any>
    ): Promise<void> {
        await LocalAPI.profileSessionStorage.set(this.#profileId, this.#sessionId, accessorId, data);
    }


    async getFormValues(rtId: string) {
        return LocalAPI.profileSession.getFormValues(this.#profileId, this.#sessionId, rtId);
    }
    async setFormValues(rtId: string, data: Record<string, any>) {
        await LocalAPI.profileSession.setFormValues(this.#profileId, this.#sessionId, rtId, data);
    }

    readonly inputFiles = {
        getPreviews: async () => LocalAPI.profileSessionStorage.getInputFilePreviews(this.#profileId, this.#sessionId),
        add: async (filename: string, base64Data: string) => await LocalAPI.profileSessionStorage.addInputFile(this.#profileId, this.#sessionId, filename, base64Data),
        update: async (fileHashes: InputFileHash[]) => LocalAPI.profileSessionStorage.updateInputFiles(this.#profileId, this.#sessionId, fileHashes),
    } as const;

    readonly history = {
        get: async (offset: number = 0, limit: number = 100, desc: boolean) => LocalAPI.profileSessionHistory.get(this.#profileId, this.#sessionId, offset, limit, desc),
        search: async (offset: number = 0, limit: number = 100, search: HistorySearch) => LocalAPI.profileSessionHistory.search(this.#profileId, this.#sessionId, offset, limit, search),
        getMessage: async (historyIds: number[]) => LocalAPI.profileSessionHistory.getMessage(this.#profileId, this.#sessionId, historyIds),
        deleteMessage: async (historyId: number, origin: 'in' | 'out' | 'both') => LocalAPI.profileSessionHistory.deleteMessage(this.#profileId, this.#sessionId, historyId, origin),
        delete: async (historyKey: number) => LocalAPI.profileSessionHistory.delete(this.#profileId, this.#sessionId, historyKey),
        deleteAll: async () => LocalAPI.profileSessionHistory.deleteAll(this.#profileId, this.#sessionId),
    } as const;
}

export default SessionAPI;