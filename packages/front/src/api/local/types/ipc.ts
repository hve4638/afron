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
}
