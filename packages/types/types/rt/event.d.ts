import '../prompt-form';

type RTEventDataError = {
    type: 'error'
    detail: string[];
} & (
        {
            reason_id:
            'no_result'
            | 'prompt_build_failed'
            | 'prompt_execute_failed'
            | 'fetch_failed'
            | 'request_failed'
            | 'invalid_model'
            | 'aborted'
            | 'other';
        } | {
            reason_id: 'http_error'
            http_status: number;
        } | {
            reason_id: 'env_error';
            title: string;
        }
    )
type RTEventDataUpdate = {
    type: 'update'
    update_types: ('input' | 'output' | 'history')[];
}
type RTEventDataSend = {
    type: 'send_raw_request_preview';
    preview: RTEventPreviewData;
} | {
    type: 'send_info';

    title: string;
    description: string;
    item: Array<{
        name?: string;
        value: string;
    }>;
}
type RTEventDataOutput = {
    type: 'stream_output';
    text: string;
} | {
    type: 'clear_output';
} | {
    type: 'set_output';
    text: string;
}
type RTEventDataOthers = {
    type: 'close';
}



declare global {
    type RTEventPreviewData = {
        url: string;
        headers: object;
        data: object;
    };

    type RTEventDataWithoutId = (
        RTEventDataError
        | RTEventDataSend
        | RTEventDataUpdate
        | RTEventDataOutput
        | RTEventDataOthers
    );

    type RTEventData = {
        id: string;
    } & RTEventDataWithoutId;
}

export { };