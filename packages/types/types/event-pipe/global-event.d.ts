import '../prompt-form';

type GlobalEventDataError = {
    type: 'error'
    detail: string[];
} & (
        {
            reason_id:
            'other';
        }
    )
type GlobalEventDataRTExport = {
    type: 'rt_export';
    state: 'ready' | 'cancel' | 'done' | 'block';
} | {
    type: 'rt_export';
    state: 'progress';
    percent: number;
    description: string;
}

type GlobalEventDataRTImport = {
    type: 'rt_import';
    state: 'ready' | 'cancel' | 'done' | 'block' | 'failed';
}

type GlobalEventDataClose = {
    type: 'close';
}

export type GlobalEventDataWithoutId = (
    GlobalEventDataRTImport
    | GlobalEventDataRTExport
    | GlobalEventDataError
    | GlobalEventDataClose
);
    

export type GlobalEventData = {
    id: string;
} & GlobalEventDataWithoutId;

export { };