import { IPCInvokers } from './invokers';
import { ENoResult, EResult } from './result';

export type IPCInvokerInterface = {
    general: IPCInvokers.General;
    globalStorage: IPCInvokers.GlobalStorage;
    masterKey: IPCInvokers.MasterKey;

    profiles: IPCInvokers.Profiles;
    profile: IPCInvokers.Profile;
    profileStorage: IPCInvokers.ProfileStorage;
    profileSessions: IPCInvokers.ProfileSessions;
    profileSession: IPCInvokers.ProfileSession;
    profileSessionStorage: IPCInvokers.ProfileSessionStorage;
    profileSessionHistory: IPCInvokers.ProfileSessionHistory;

    profileRTs: IPCInvokers.ProfileRTs;
    profileRT: IPCInvokers.ProfileRT;
    profileRTStorage: IPCInvokers.ProfileRTStorage;
    profileRTPrompt: IPCInvokers.ProfileRTPrompt;
    profileRTFlow: IPCInvokers.ProfileRTFlow;

    request: IPCInvokers.Request;
}

export type IPCListenerInterface = {
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

export type IPCInterface = IPCInvokerInterface & IPCListenerInterface;

export type IPCInvokerPath = {
    [KEY in keyof IPCInvokerInterface]: {
        [KEY2 in keyof IPCInvokerInterface[KEY]]: 0
    };
};