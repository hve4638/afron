import { IPCError } from 'api/error';
import { IIPCAPI } from './types';

const electron = window.electron;

class ElectronIPCAPI implements IIPCAPI {
    static instance: ElectronIPCAPI | null = null;

    static getInstance() {
        ElectronIPCAPI.instance ??= new ElectronIPCAPI();
        return ElectronIPCAPI.instance;
    }

    private constructor() { }

    async addRequestListener(listener) {
        const [err, bindId] = await electron.addRequestListener(listener);
        if (err) throw new IPCError(err.message);

        return bindId;
    }
    async removeRequestListener(listener) {
        await electron.removeRequestListener(listener);
    }

    general = {
        async echo(message: any) {
            const [_, data] = await electron.general.echo(message);
            return data;
        },
        async openBrowser(url: string) {
            await electron.general.openBrowser(url);
        },
        async getCurrentVersion() {
            const [err, version] = await electron.general.getCurrentVersion();
            if (err) throw new IPCError(err.message);
            return version;
        },
        async getAvailableVersion(prerelease: boolean = false) {
            const [err, info] = await electron.general.getAvailableVersion(prerelease);
            if (err) throw new IPCError(err.message);
            return info;
        },
        async getChatAIModels() {
            const [err, models] = await electron.general.getChatAIModels();
            if (err) throw new IPCError(err.message);

            return models;
        },
        
        async existsLegacyData() {
            const [err, exists] = await electron.general.existsLegacyData();
            if (err) throw new IPCError(err.message);
            return exists;
        },
        async migrateLegacyData() {
            const [err] = await electron.general.migrateLegacyData();
            if (err) throw new IPCError(err.message);
        },
        async ignoreLegacyData() {
            const [err] = await electron.general.ignoreLegacyData();
            if (err) throw new IPCError(err.message);
        }
    } as const;
    masterKey = {
        async init() {
            const [err, result] = await electron.masterKey.init();
            if (err) throw new IPCError(err.message);
            return result;
        },
        async reset(recoveryKey: string) {
            const [err] = await electron.masterKey.reset(recoveryKey);
            if (err) throw new IPCError(err.message);
        },
        async recover(recoveryKey: string) {
            const [err, success] = await electron.masterKey.recover(recoveryKey);
            if (err) throw new IPCError(err.message);
            return success;
        }
    } as const;
    globalStorage = {
        async get(storageName: string, keys: string[]) {
            const [err, data] = await electron.globalStorage.get(storageName, keys);
            if (err) throw new IPCError(err.message);
            return data;
        },
        async set(storageName: string, data: KeyValueInput) {
            const [err] = await electron.globalStorage.set(storageName, data);
            if (err) throw new IPCError(err.message);
        }
    } as const;
    profiles = {
        async create() {
            const [err, id] = await electron.profiles.create();
            if (err) throw new IPCError(err.message);
            return id;
        },
        async delete(id: string) {
            const [err] = await electron.profiles.delete(id);
            if (err) throw new IPCError(err.message);
        },
        async getIds() {
            const [err, profiles] = await electron.profiles.getIds();
            if (err) throw new IPCError(err.message);

            return profiles;
        },
        async getLast() {
            const [err, profile] = await electron.profiles.getLast();
            if (err) throw new IPCError(err.message);

            return profile;
        },
        async setLast(id: string | null) {
            const [err] = await electron.profiles.setLast(id);
            if (err) throw new IPCError(err.message);
        },
        async getOrphanIds() {
            const [err, ids] = await electron.profiles.getOrphanIds();
            if (err) throw new IPCError(err.message);
            return ids;
        },
        async recoverOrphan(profileId: string) {
            const [err] = await electron.profiles.recoverOrphan(profileId);
            if (err) throw new IPCError(err.message);
        }
    } as const;
    profile = {
        async getCustomModels(profileId:string) {
            const [err, model] = await electron.profile.getCustomModels(profileId);
            if (err) throw new IPCError(err.message)
                
            return model;
        },
        async setCustomModel(profileId:string, model:CustomModel) {
            const [err, customId] = await electron.profile.setCustomModel(profileId, model);
            if (err) throw new IPCError(err.message);

            return customId;
        },
        async removeCustomModel(profileId:string, customId:string) {
            const [err] = await electron.profile.removeCustomModel(profileId, customId);
            if (err) throw new IPCError(err.message);
        },
    }
    profileStorage = {
        async set(profileId:string, accessorId:string, data:KeyValueInput) {
            const [err] = await electron.profileStorage.set(profileId, accessorId, data);
            if (err) throw new IPCError(err.message);
        },
        async get(profileId:string, accessorId:string, keys:string[]) {
            const [err, result] = await electron.profileStorage.get(profileId, accessorId, keys);
            if (err) throw new IPCError(err.message);
            return result;
        },
        async getAsText(profileId:string, accessorId:string):Promise<string> {
            const [err, contents] = await electron.profileStorage.getAsText(profileId, accessorId);
            if (err) throw new IPCError(err.message);
            return contents;
        },
        async setAsText(profileId:string, accessorId:string, contents:string) {
            const [err] = await electron.profileStorage.setAsText(profileId, accessorId, contents);
            if (err) throw new IPCError(err.message);
        },
        async getAsBinary(profileId:string, accessorId:string):Promise<Buffer> {
            const [err, buffer] = await electron.profileStorage.getAsBinary(profileId, accessorId);
            if (err) throw new IPCError(err.message);
            return buffer;
        },
        async setAsBinary(profileId:string, accessorId:string, buffer:Buffer) {
            const [err] = await electron.profileStorage.setAsBinary(profileId, accessorId, buffer);
            if (err) throw new IPCError(err.message);
        },
        async verifyAsSecret(profileId:string, accessorId:string, keys:string[]) {
            const [err, result] = await electron.profileStorage.verifyAsSecret(profileId, accessorId, keys);
            if (err) throw new IPCError(err.message);
            return result;
        },
        async setAsSecret(profileId:string, accessorId:string, data:KeyValueInput) {
            const [err] = await electron.profileStorage.setAsSecret(profileId, accessorId, data);
            if (err) throw new IPCError(err.message);
        },
        async removeAsSecret(profileId:string, accessorId:string, keys:string[]) {
            const [err] = await electron.profileStorage.removeAsSecret(profileId, accessorId, keys);
            if (err) throw new IPCError(err.message);
        },
    } as const;
    profileSessions = {
        async getIds(profileId:string):Promise<string[]> {
            const [err, sessionIds] = await electron.profileSessions.getIds(profileId);
            if (err) throw new IPCError(err.message);
    
            return sessionIds;
        },
        async add(profileId:string) {
            const [err, sid] = await electron.profileSessions.add(profileId);
            if (err) throw new IPCError(err.message);
            return sid;
        },
        async remove(profileId:string, sessionId:string) {
            const [err] = await electron.profileSessions.remove(profileId, sessionId);
            if (err) throw new IPCError(err.message);
        },
        async reorder(profileId:string, sessions:string[]):Promise<void> {
            const [err] = await electron.profileSessions.reorder(profileId, sessions);
            if (err) throw new IPCError(err.message);
        },
        async undoRemoved(profileId:string) {
            const [err, sid] = await electron.profileSessions.undoRemoved(profileId);
            if (err) throw new IPCError(err.message);
    
            return sid;
        },
    } as const;
    profileSession = {
        async getFormValues(profileId:string, sessionId:string, rtId:string):Promise<Record<string, any>> {
            const [err, values] = await electron.profileSession.getFormValues(profileId, sessionId, rtId);
            if (err) throw new IPCError(err.message);

            return values;
        },
        async setFormValues(profileId:string, sessionId:string, rtId:string, data:Record<string, any>) {
            const [err] = await electron.profileSession.setFormValues(profileId, sessionId, rtId, data);
            if (err) throw new IPCError(err.message);
        }
    } as const;
    profileSessionStorage = {
        async get(profileId:string, sessionId:string, accessorId:string, keys:string[]) {
            const [err, data] = await electron.profileSessionStorage.get(profileId, sessionId, accessorId, keys);
            if (err) throw new IPCError(err.message);
    
            return data;
        },
        async set(profileId:string, sessionId:string, accessorId:string, data:KeyValueInput) {
            const [err] = await electron.profileSessionStorage.set(profileId, sessionId, accessorId, data);
            if (err) throw new IPCError(err.message);
        },
        async getInputFilePreviews(profileId: string, sessionId: string) {
            const [err, files] = await electron.profileSessionStorage.getInputFilePreviews(profileId, sessionId);
            if (err) throw new IPCError(err.message);
    
            return files;
        },
        async addInputFile(profileId: string, sessionId: string, filename: string, dataBase64: string) {
            const [err, metadata] = await electron.profileSessionStorage.addInputFile(profileId, sessionId, filename, dataBase64);
            if (err) throw new IPCError(err.message);

            return metadata;
        },
        async updateInputFiles(profileId: string, sessionId: string, fileHashes: InputFileHash[]) {
            const [err, metadataList] = await electron.profileSessionStorage.updateInputFiles(profileId, sessionId, fileHashes);
            if (err) throw new IPCError(err.message);

            return metadataList;
        },
    } as const;
    profileSessionHistory = {
        async get(profileId:string, sessionId:string, offset:number=0, limit:number=100, desc:boolean=false) {
            const [err, history] = await electron.profileSessionHistory.get(profileId, sessionId, offset, limit, desc);
            if (err) throw new IPCError(err.message);
    
            return history;
        },
        async search(profileId:string, sessionId:string, offset:number=0, limit:number=100, search:HistorySearch) {
            const [err, history] = await electron.profileSessionHistory.search(profileId, sessionId, offset, limit, search);
            if (err) throw new IPCError(err.message);
    
            return history;
        },
        async getMessage(profileId:string, sessionId:string, historyIds:number[]) {
            const [err, messages] = await electron.profileSessionHistory.getMessage(profileId, sessionId, historyIds);
            if (err) throw new IPCError(err.message);
    
            return messages;
        },
        async deleteMessage(profileId:string, sessionId:string, historyId:number, origin:'in' | 'out' | 'both') {
            const [err] = await electron.profileSessionHistory.deleteMessage(profileId, sessionId, historyId, origin);
            if (err) throw new IPCError(err.message);
        },
        async delete(profileId:string, sessionId:string, historyKey:number) {
            const [err] = await electron.profileSessionHistory.delete(profileId, sessionId, historyKey);
            if (err) throw new IPCError(err.message);
        },
        async deleteAll(profileId:string, sessionId:string) {
            const [err] = await electron.profileSessionHistory.deleteAll(profileId, sessionId);
            if (err) throw new IPCError(err.message);
        }
    } as const;
    profileRTs = {
        async createUsingTemplate(profileId:string, metadata:RTMetadata, templateId:string):Promise<string> {
            const [err] = await electron.profileRTs.createUsingTemplate(profileId, metadata, templateId);
            if (err) throw new IPCError(err.message);
            return profileId;
        },
        async getTree(profileId:string):Promise<RTMetadataTree> {
            const [err, tree] = await electron.profileRTs.getTree(profileId);
            if (err) throw new IPCError(err.message);
            return tree;
        },
        async updateTree(profileId:string, tree:RTMetadataTree) {
            const [err] = await electron.profileRTs.updateTree(profileId, tree);
            if (err) throw new IPCError(err.message);
        },
        async generateId(profileId:string) {
            const [err, rtId] = await electron.profileRTs.generateId(profileId);
            if (err) throw new IPCError(err.message);
            return rtId;
        },
        async add(profileId:string, metadata:RTMetadata) {
            const [err] = await electron.profileRTs.add(profileId, metadata);
            if (err) throw new IPCError(err.message);
        },
        async remove(profileId:string, rtId:string) {
            const [err] = await electron.profileRTs.remove(profileId, rtId);
            if (err) throw new IPCError(err.message);
        },
        async existsId(profileId:string, rtId:string) {
            const [err, exists] = await electron.profileRTs.existsId(profileId, rtId);
            if (err) throw new IPCError(err.message);
            return exists;
        },
        async changeId(profileId:string, oldId:string, newId:string) {
            const [err] = await electron.profileRTs.changeId(profileId, oldId, newId);
            if (err) throw new IPCError(err.message);
        },
        async reflectMetadata(profileId: string, rtId: string) {
            const [err] = await electron.profileRT.reflectMetadata(profileId, rtId);
            if (err) throw new IPCError(err.message);
        }
    } as const;
    profileRT = {
        async getMetadata(profileId:string, rtId:string):Promise<RTIndex> {
            const [err, metadata] = await electron.profileRT.getMetadata(profileId, rtId);
            if (err) throw new IPCError(err.message);
            return metadata;
        },
        async setMetadata(profileId:string, rtId:string, metadata:KeyValueInput) {
            const [err] = await electron.profileRT.setMetadata(profileId, rtId, metadata);
            if (err) throw new IPCError(err.message);
        },
        async reflectMetadata(profileId:string, rtId:string) {
            const [err] = await electron.profileRT.reflectMetadata(profileId, rtId);
            if (err) throw new IPCError(err.message);
        },
        async getForms(profileId:string, rtId:string):Promise<PromptVar[]> {
            const [err, forms] = await electron.profileRT.getForms(profileId, rtId);
            if (err) throw new IPCError(err.message);
            return forms;
        },
        async addNode(profileId:string, rtId:string, nodeCategory:string):Promise<number> {
            const [err, nodeId] = await electron.profileRT.addNode(profileId, rtId, nodeCategory);
            if (err) throw new IPCError(err.message);
            return nodeId;
        },
        async removeNode(profileId:string, rtId:string, nodeId:number) {
            const [err] = await electron.profileRT.removeNode(profileId, rtId, nodeId);
            if (err) throw new IPCError(err.message);
        },
        async updateNodeOption(profileId:string, rtId:string, nodeId:number, option:Record<string, unknown>) {
            const [err] = await electron.profileRT.updateNodeOption(profileId, rtId, nodeId, option);
            if (err) throw new IPCError(err.message);
        },
        async connectNode(profileId:string, rtId:string, connectFrom:RTNodeEdge, connectTo:RTNodeEdge) {
            const [err] = await electron.profileRT.connectNode(profileId, rtId, connectFrom, connectTo);
            if (err) throw new IPCError(err.message);
        },
        async disconnectNode(profileId:string, rtId:string, connectFrom:RTNodeEdge, connectTo:RTNodeEdge) {
            const [err] = await electron.profileRT.disconnectNode(profileId, rtId, connectFrom, connectTo);
            if (err) throw new IPCError(err.message);
        },
    } as const;
    profileRTStorage = {
        async get(profileId:string, rtId:string, accessorId:string, keys:string[]) {
            const [err, data] = await electron.profileRTStorage.get(profileId, rtId, accessorId, keys);
            if (err) throw new IPCError(err.message);
            return data;
        },
        async set(profileId:string, rtId:string, accessorId:string, data:KeyValueInput) {
            const [err] = await electron.profileRTStorage.set(profileId, rtId, accessorId, data);
            if (err) throw new IPCError(err.message);
        },
    } as const;
    profileRTPrompt = {
        async getMetadata(profileId:string, rtId:string, promptId:string):Promise<RTPromptData> {
            const [err, metadata] = await electron.profileRTPrompt.getMetadata(profileId, rtId, promptId);
            if (err) throw new IPCError(err.message);
            return metadata;
        },
        async setMetadata(profileId:string, rtId:string, promptId:string, metadata:RTPromptDataEditable) {
            const [err] = await electron.profileRTPrompt.setMetadata(profileId, rtId, promptId, metadata);
            if (err) throw new IPCError(err.message);
        },
        
        async getName(profileId:string, rtId:string, promptId:string):Promise<string> {
            const [err, name] = await electron.profileRTPrompt.getName(profileId, rtId, promptId);
            if (err) throw new IPCError(err.message);
            return name;
        },
        async setName(profileId:string, rtId:string, promptId:string, name:string) {
            const [err] = await electron.profileRTPrompt.setName(profileId, rtId, promptId, name);
            if (err) throw new IPCError(err.message);
        },

        async getVariableNames(profileId:string, rtId:string, promptId:string):Promise<string[]> {
            const [err, ids] = await electron.profileRTPrompt.getVariableNames(profileId, rtId, promptId);
            if (err) throw new IPCError(err.message);
            return ids;
        },
        async getVariables(profileId:string, rtId:string, promptId:string):Promise<PromptVar[]> {
            const [err, variables] = await electron.profileRTPrompt.getVariables(profileId, rtId, promptId);
            if (err) throw new IPCError(err.message);
            return variables;
        },
        async setVariables(profileId:string, rtId:string, promptId:string, vars:PromptVar[]) {
            const [err, ids] = await electron.profileRTPrompt.setVariables(profileId, rtId, promptId, vars);
            if (err) throw new IPCError(err.message);

            return ids;
        },
        async removeVariables(profileId:string, rtId:string, promptId:string, formIds:string[]) {
            const [err] = await electron.profileRTPrompt.removeVariables(profileId, rtId, promptId, formIds);
            if (err) throw new IPCError(err.message);
        },
        
        async getContents(profileId:string, rtId:string, promptId:string):Promise<string> {
            const [err, contents] = await electron.profileRTPrompt.getContents(profileId, rtId, promptId);
            if (err) throw new IPCError(err.message);
            return contents;
        },
        async setContents(profileId:string, rtId:string, promptId:string, contents:string) {
            const [err] = await electron.profileRTPrompt.setContents(profileId, rtId, promptId, contents);
            if (err) throw new IPCError(err.message);
        }
    } as const;
    request = {
        async requestRT(token:string, profileId:string, sessionId:string) {
            const [err] = await window.electron.request.requestRT(token, profileId, sessionId);
            if (err) throw new IPCError(err.message);
        },
        async previewPrompt(token:string, profileId:string, sessionId:string) {
            const [err] = await window.electron.request.previewPrompt(token, profileId, sessionId);
            if (err) throw new IPCError(err.message);
        },
        async abort(token:string) {
            const [err] = await window.electron.request.abort(token);
            if (err) throw new IPCError(err.message);
        }
    } as const;
}

export default ElectronIPCAPI;