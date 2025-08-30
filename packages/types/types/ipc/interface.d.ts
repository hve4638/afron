import './invokers';
import './listeners';
import './result';

declare global {
    type IPCInvokerInterface = {
        general: IPCInvokerGeneral;
        globalStorage: IPCInvokerGlobalStorage;
        masterKey: IPCInvokerMasterKey;

        profiles: IPCInvokerProfiles;
        profile: IPCInvokerProfile;
        profileStorage: IPCInvokerProfileStorage;
        profileSessions: IPCInvokerProfileSessions;
        profileSession: IPCInvokerProfileSession;
        profileSessionStorage: IPCInvokerProfileSessionStorage;
        profileSessionHistory: IPCInvokerProfileSessionHistory;

        profileRTs: IPCInvokerProfileRTs;
        profileRT: IPCInvokerProfileRT;
        profileRTStorage: IPCInvokerProfileRTStorage;
        profileRTPrompt: IPCInvokerProfileRTPrompt;

        request: IPCInvokerRequest;
    }

    type IPCListenerInterface = {
        /** @deprecated */
        addRequestListener(listener: (event: any, token: string, data: any) => void): EResult<number>;
        /** @deprecated */
        removeRequestListener(bindId: number): ENoResult;

        events: {
            onRequest(listener: (event: any, token: string, data: any) => void): EResult<number>;
            onGlobal(listener: (event: any, token: string, data: any) => void): EResult<number>;
            onDebug(listener: (event: any, token: string, data: any) => void): EResult<number>;
            off(bindId: number): ENoResult;
        }
    };

    type IPCInterface = IPCInvokerInterface & IPCListenerInterface;

    type IPCInvokerPath = {
        [KEY in keyof IPCInvokerInterface]: {
            [KEY2 in keyof IPCInvokerInterface[KEY]]: 0
        };
    };
}