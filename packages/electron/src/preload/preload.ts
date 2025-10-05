import { contextBridge, ipcRenderer } from 'electron';
import { IPCListenerPing } from '../data';
import { createListenerManager } from './listener-utils';

type IPCInvokerKeys = keyof IPCInvokerInterface;
type IPCInvokerPath = {
    [KEY in keyof IPCInvokerInterface]: {
        [KEY2 in keyof IPCInvokerInterface[KEY]]: 0
    };
};

// 런타임 시점 참조를 위한 객체
// 타입에 묶여있어 IPC API 수정후 preload 반영을 까먹으면 빌드에 실패하도록 하기 위함
const ipcInvokerPath = {
    general: {
        echo: 0,
        openBrowser: 0,
        getCurrentVersion: 0,
        getAvailableVersion: 0,

        getChatAIModels: 0,

        existsLegacyData: 0,
        migrateLegacyData: 0,
        ignoreLegacyData: 0,
    },
    globalStorage: {
        get: 0,
        set: 0,
    },
    masterKey: {
        init: 0,
        reset: 0,
        recover: 0,
    },
    profiles: {
        create: 0,
        delete: 0,
        getIds: 0,
        getLast: 0,
        setLast: 0,
        getOrphanIds: 0,
        recoverOrphan: 0,
    },
    profile: {
        getCustomModels: 0,
        setCustomModel: 0,
        removeCustomModel: 0,

        getGlobalModelConfig: 0,
        setGlobalModelConfig: 0,
    },
    profileStorage: {
        get: 0,
        set: 0,
        getAsText: 0,
        setAsText: 0,
        getAsBinary: 0,
        setAsBinary: 0,
        verifyAsSecret: 0,
        setAsSecret: 0,
        removeAsSecret: 0,
    },
    profileSessions: {
        add: 0,
        remove: 0,
        undoRemoved: 0,
        reorder: 0,
        getIds: 0,
    },
    profileSession: {
        getFormValues: 0,
        setFormValues: 0,
    },
    profileSessionStorage: {
        get: 0,
        set: 0,
        getInputFilePreviews: 0,
        addInputFile: 0,
        updateInputFiles: 0,
    },
    profileSessionHistory: {
        get: 0,
        search: 0,
        getMessage: 0,
        deleteMessage: 0,
        delete: 0,
        deleteAll: 0,
    },
    profileRTs: {
        getTree: 0,
        updateTree: 0,
        add: 0,
        createUsingTemplate: 0,
        remove: 0,
        existsId: 0,
        generateId: 0,
        changeId: 0,
        exportFile: 0,
        importFile: 0,
    },
    profileRT: {
        getMetadata: 0,
        setMetadata: 0,
        reflectMetadata: 0,

        getForms: 0,
    },
    profileRTStorage: {
        get: 0,
        set: 0,
    },
    profileRTPrompt: {
        getMetadata: 0,
        setMetadata: 0,
        getName: 0,
        setName: 0,
        getVariableNames: 0,
        getVariables: 0,
        setVariables: 0,
        removeVariables: 0,
        getContents: 0,
        setContents: 0,
    },
    request: {
        requestRT: 0,
        previewPrompt: 0,
        abort: 0,
    },
} satisfies IPCInvokerPath;

// 위 ipcInvokerPath를 기반으로 프론트에 expose할 ipc 객체 생성
const ipcInvokers: IPCInvokerInterface = Object.fromEntries(
    Object.entries(ipcInvokerPath).map(
        ([key1, category]) => [
            key1 as IPCInvokerKeys,
            Object.fromEntries(
                Object.entries(category).map(
                    ([key2, _]) => [
                        key2,
                        (...args: any) => ipcRenderer.invoke(`${key1}_${key2}`, ...args)
                    ],
                ) satisfies [string, (...args: any) => Promise<any>][],
            ) as Record<string, (...args: any) => Promise<any>>
        ] as [IPCInvokerKeys, Record<string, (...args: any) => Promise<any>>]
    ) as [IPCInvokerKeys, Record<string, (...args: any) => Promise<any>>][]
) as IPCInvokerInterface;

const listenerManager = createListenerManager();

const ipcListeners: IPCListenerInterface = {
    addRequestListener: async (listener) => {
        return listenerManager.add(IPCListenerPing.Request, listener);
    },
    removeRequestListener: async (bindId: number) => {
        return listenerManager.remove(bindId);
    },

    events: {
        onRequest: async (listener) => {
            return listenerManager.add(IPCListenerPing.Request, listener);
        },
        onGlobal: async (listener) => {
            return listenerManager.add(IPCListenerPing.Global, listener);
        },
        onDebug: async (listener) => {
            return listenerManager.add(IPCListenerPing.Debug, listener);
        },
        off: async (bindId: number) => {
            return listenerManager.remove(bindId);
        },
    }
};

const ipcExports = {
    ...ipcInvokers,
    ...ipcListeners,
}

contextBridge.exposeInMainWorld('electron', ipcExports);