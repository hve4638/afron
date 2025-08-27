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
type GlobalEventDataExportFile = {
    type: 'export_rt_to_file';
    state: 'ready' | 'cancel' | 'done' | 'block';
} | {
    type: 'export_rt_to_file';
    state: 'progress';
    percent: number;
    description: string;
}

type GlobalEventDataClose = {
    type: 'close';
}

declare global {
    type GlobalEventDataWithoutId = (
        GlobalEventDataError
        | GlobalEventDataExportFile
        | GlobalEventDataClose
    );

    type GlobalEventData = {
        id: string;
    } & GlobalEventDataWithoutId;
}

export { };