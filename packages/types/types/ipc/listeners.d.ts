import { ENoResult } from  './result';

export type IPCListenersInterface = {
    AddRequestListener(listener: (event: any, token: string, data: any) => void): EResult<number>;
    RemoveRequestListener(bindId: number): ENoResult;
}

