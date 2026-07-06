import { IPCInvokerInterface, IPCListenerInterface } from "@afron/types";

/// @TODO: 임시 eslint 비활성화
/// 추후 타입 정리 필요
export type IIPCAPI = {
    [KEY in keyof IPCInvokerInterface]: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
        [KEY2 in keyof IPCInvokerInterface[KEY]]: Function
    }
} & {
    [KEY in keyof IPCListenerInterface]: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
        [KEY2 in keyof IPCListenerInterface[KEY]]: Function
    }
} & {
    /** 플랫폼 전용 작업 (해당 플랫폼이 아닌 빌드에서는 undefined) */
    platform?: {
        /** 웹 빌드에서만 존재. 브라우저 File API + HTTP 기반 파일 송수신 */
        web?: {
            uploadRTFile(token: string, profileId: string, file: File): Promise<void>;
            downloadRTFile(profileId: string, rtId: string): Promise<void>;
        };
    };
}
