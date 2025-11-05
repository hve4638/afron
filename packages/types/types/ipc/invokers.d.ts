import { ChatAIModelData } from '../chatai/chatai-model';
import { GlobalModelConfiguration, ProfileStorage } from '../storage-struct';
import { RTMetadata, RTMetadataTree } from '../rt/rt';
import { RTFormNaive, RTPromptDataEditable, RTPromptMetadata } from '../rt/form';
import { RTFlowData } from '../rt';

import { EResult, ENoResult, } from './result';
import { CustomModel, HistoryMessage, HistoryMetadata, HistorySearch, InputFileHash, InputFilePreview, InputFilesUpdateInfo, VersionInfo } from './data';
import { KeyValueInput } from './declared';
import { RTVar, RTVarCreate, RTVarUpdate } from '../rt-var';

export interface IPCInvokerGeneral {
    echo(message: string): EResult<string>;
    openBrowser(url: string): ENoResult;
    getCurrentVersion(): EResult<string>;
    getAvailableVersion(prerelease: boolean): EResult<VersionInfo>;
    getChatAIModels(): EResult<ChatAIModelData>;

    existsLegacyData(): EResult<boolean>;
    migrateLegacyData(): ENoResult;
    ignoreLegacyData(): ENoResult;
}
export declare namespace IPCInvokers {
    interface General {
        echo(message: string): EResult<string>;
        openBrowser(url: string): ENoResult;
        getCurrentVersion(): EResult<string>;
        getAvailableVersion(prerelease: boolean): EResult<VersionInfo>;
        getChatAIModels(): EResult<ChatAIModelData>;

        existsLegacyData(): EResult<boolean>;
        migrateLegacyData(): ENoResult;
        ignoreLegacyData(): ENoResult;
    }

    interface GlobalStorage {
        get(storageName: string, keys: string[]): EResult<Record<string, any>>;
        set(storageName: string, data: KeyValueInput): ENoResult;
    }

    interface MasterKey {
        init(): EResult<'normal' | 'need-recovery' | 'no-data' | 'invalid-data'>;
        reset(recoveryKey: string): ENoResult;
        recover(recoveryKey: string): EResult<boolean>;
    }

    interface Profiles {
        create(): EResult<string>;
        delete(profileName: string): ENoResult;
        getIds(): EResult<string[]>;

        getLast(): EResult<string | null>;
        setLast(profileName: string | null): ENoResult;

        getOrphanIds(): EResult<string[]>;
        recoverOrphan(profileId: string): ENoResult;
    }

    interface Profile {
        getCustomModels(profileId: string): EResult<CustomModel[]>;
        setCustomModel(profileId: string, model: CustomModel): EResult<string>;
        removeCustomModel(profileId: string, customId: string): ENoResult;

        getGlobalModelConfig(profileId: string, modelId: string): EResult<GlobalModelConfiguration>;
        setGlobalModelConfig(profileId: string, modelId: string, config: GlobalModelConfiguration): ENoResult;
    }

    interface ProfileStorage {
        get(profileId: string, accessor: string, keys: string[]): EResult<Record<string, any>>;
        set(profileId: string, accessor: string, data: KeyValueInput): ENoResult;
        getAsText(profileId: string, accessor: string): EResult<string>;
        setAsText(profileId: string, accessor: string, value: string): ENoResult;
        getAsBinary(profileId: string, accessor: string): EResult<Buffer>;
        setAsBinary(profileId: string, accessor: string, content: Buffer): ENoResult;
        verifyAsSecret(profileId: string, accessor: string, keys: string[]): EResult<boolean[]>;
        setAsSecret(profileId: string, accessor: string, data: KeyValueInput): ENoResult;
        removeAsSecret(profileId: string, accessor: string, keys: string[]): ENoResult;
    }

    interface ProfileSessions {
        add(profileId: string): EResult<string>;
        remove(profileId: string, sessionId: string): ENoResult;
        undoRemoved(profileId: string): EResult<string>;
        reorder(profileId: string, sessions: string[]): ENoResult;
        getIds(profileId: string): EResult<string[]>;
    }

    interface ProfileSession {
        getFormValues(profileId: string, sessionId: string, rtId: string): EResult<Record<string, any>>;
        setFormValues(profileId: string, sessionId: string, rtId: string, values: Record<string, any>): ENoResult;
    }

    interface ProfileSessionStorage {
        get(profileId: string, sessionId: string, accessor: string, keys: string[]): EResult<Record<string, any>>;
        set(profileId: string, sessionId: string, accessor: string, key: KeyValueInput): ENoResult;
        // getInputFiles(profileId: string, sessionId: string, fileHashes: string[]): EResult<InputFileEntry[]>;
        getInputFilePreviews(profileId: string, sessionId: string): EResult<InputFilePreview[]>;
        addInputFile(profileId: string, sessionId: string, filename: string, dataURI: string): EResult<InputFilePreview>;
        updateInputFiles(profileId: string, sessionId: string, fileHashes: InputFileHash[]): EResult<InputFilesUpdateInfo>;
    }

    interface ProfileSessionHistory {
        get(profileId: string, sessionId: string, offset: number, limit: number, desc: boolean): EResult<HistoryMetadata[]>;
        search(profileId: string, sessionId: string, offset: number, limit: number, search: HistorySearch): EResult<HistoryMetadata[]>;
        getMessage(profileId: string, sessionId: string, historyId: number[]): EResult<HistoryMessage[]>;
        deleteMessage(profileId: string, sessionId: string, historyId: number, origin: 'in' | 'out' | 'both'): ENoResult;
        delete(profileId: string, sessionId: string, historyKey: number): ENoResult;
        deleteAll(profileId: string, sessionId: string): ENoResult;
    }

    interface ProfileRTs {
        getTree(profileId: string): EResult<RTMetadataTree>;
        updateTree(profileId: string, tree: RTMetadataTree): ENoResult;
        /** @deprecated use createUsingTemplate instead */
        add(profileId: string, rt: RTMetadata): ENoResult;
        createUsingTemplate(profileId: string, rtMetadata: RTMetadata, templateId: string): ENoResult;
        remove(profileId: string, rtId: string): ENoResult;

        existsId(profileId: string, rtId: string): EResult<boolean>;

        generateId(profileId: string): EResult<string>;
        changeId(profileId: string, oldRTId: string, newRTId: string): ENoResult;

        importFile(token: string, profileId: string): ENoResult;
        exportFile(token: string, profileId: string, rtId: string): ENoResult;
    }

    interface ProfileRT {
        getMetadata(profileId: string, rtId: string): EResult<ProfileStorage.RT.Index>;
        setMetadata(profileId: string, rtId: string, metadata: KeyValueInput): ENoResult;
        reflectMetadata(profileId: string, rtId: string): ENoResult;

        getForms(profileId: string, rtId: string): EResult<RTFormNaive[]>;
    }

    interface ProfileRTStorage {
        get(profileId: string, rtId: string, accessor: string, keys: string[]): EResult<Record<string, any>>;
        set(profileId: string, rtId: string, accessor: string, data: KeyValueInput): ENoResult;
    }

    interface ProfileRTPrompt {
        getMetadata(profileId: string, rtId: string, promptId: string): EResult<RTPromptMetadata>;
        setMetadata(profileId: string, rtId: string, promptId: string, metadata: RTPromptDataEditable): ENoResult;

        getName(profileId: string, rtId: string, promptId: string): EResult<string>;
        setName(profileId: string, rtId: string, promptId: string, name: string): ENoResult;

        getVariableNames(profileId: string, rtId: string, promptId: string): EResult<string[]>;

        getVariables(profileId: string, rtId: string, promptId: string): EResult<RTVar[]>;
        setVariables(profileId: string, rtId: string, promptId: string, forms: (RTVarCreate | RTVarUpdate)[]): EResult<string[]>;
        removeVariables(profileId: string, rtId: string, promptId: string, formIds: string[]): ENoResult;
        getContents(profileId: string, rtId: string, promptId: string): EResult<string>;
        setContents(profileId: string, rtId: string, promptId: string, contents: string): ENoResult;
    }

    interface ProfileRTFlow {
        getFlowData(profileId: string, rtId: string): EResult<RTFlowData>;
        setFlowData(profileId: string, rtId: string, data: RTFlowData): ENoResult;

        getPrompts(profileId: string, rtId: string): EResult<ProfileStorage.RT.PromptOrder>;
        setPrompts(profileId: string, rtId: string, order: ProfileStorage.RT.PromptOrder): ENoResult;

        /**
         * 프롬프트 추가
         * @return 갱신된 프롬프트 순서 정보 
         */
        addPrompt(profileId: string, rtId: string, promptId: string, promptName: string): EResult<ProfileStorage.RT.PromptOrder>;
        /**
         * 프롬프트 제거
         * @return 갱신된 프롬프트 순서 정보 
         */
        removePrompt(profileId: string, rtId: string, promptId: string): EResult<ProfileStorage.RT.PromptOrder>;
    }

    interface Request {
        requestRT(token: string, profileId: string, sessionId: string): ENoResult;
        previewPrompt(token: string, profileId: string, sessionId: string): ENoResult;
        abort(token: string): ENoResult;
    }
}