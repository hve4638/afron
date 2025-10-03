import { SessionAPI } from '@/api/profiles';
import { RequestEventPipe } from '@/api/events';

import { useSessionStore } from '@/stores';
import { emitEvent } from '@/hooks/useEvent';
import { ErrorTool, SessionTool } from './tools';

export async function responseReceiver(chId: string, sessionAPI: SessionAPI) {
    const sessionUtils = new SessionTool(chId, sessionAPI);
    const errorTool = new ErrorTool(sessionAPI);

    await sessionUtils.changeState('loading');
    sessionUtils.refetchIfCurrent();
    emitEvent('refresh_session_metadata');

    while (true) {
        const data = await RequestEventPipe.receive(chId);

        if (data === null || data.type === 'close') {
            console.warn('Request closed:', data);

            await sessionUtils.changeState('done');
            emitEvent('refresh_session_metadata');

            await sessionUtils.refetchIfCurrent();
            break;
        }
        else if (data.type === 'send_raw_request_preview') {
            emitEvent('open_rt_preview_modal', data.preview);
        }
        else if (data.type === 'update') {
            for (const typeName of data.update_types) {
                if (typeName === 'input') {
                    await sessionUtils.refetchInputIfCurrent();
                }
                else if (typeName === 'output') {
                    sessionUtils.refetchOutputIfCurrent();
                    emitEvent('refresh_session_metadata');
                }
                else if (typeName === 'history') {
                    const sessionState = useSessionStore.getState();
                    if (sessionState.deps.last_session_id === sessionAPI.id) {
                        emitEvent('refresh_chat');
                    }
                }
                else {
                    console.warn('Unknown update type:', typeName);
                }
            }
        }
        else if (data.type === 'error') {
            console.warn('[Error]', data);
            switch (data.reason_id) {
                case 'no_result':
                    console.warn('No result received from request:', data);

                    sessionUtils.refetchIfCurrent();
                    emitEvent('refresh_session_metadata');

                    errorTool.noResult(data);
                    break;
                case 'request_failed':
                    errorTool.requestFailed(data);
                    break;
                case 'aborted':
                    errorTool.aborted(data);
                    break;
                case 'fetch_failed':
                    errorTool.fetchFailed(data);
                    break;
                case 'http_error':
                    errorTool.httpError(data);
                    break;
                case 'invalid_model':
                    errorTool.invalidModel(data);
                    break;
                case 'other':
                    errorTool.other(data);
                    break;
                case 'prompt_build_failed':
                    errorTool.promptBuildFailed(data);
                    break;
                case 'prompt_execute_failed':
                    errorTool.promptExecuteFailed(data);
                    break;
                case 'env_error':
                    errorTool.envError(data);
                    break;
            }
        }
        else if (data.type === 'set_output') {
            await sessionUtils.setOutput(data.text);
            await sessionUtils.refetchOutputIfCurrent();

            emitEvent('refresh_session_metadata');
        }
        else if (data.type === 'stream_output') {

        }
        else if (data.type === 'send_info') {
            // emitEvent('show_toast_message', {
            //     title: data.title,
            //     description: data.description,
            //     type: 'info',
            //     clickAction: {
            //         action: 'open_info',
            //         item: data.item,
            //     }
            // });
        }
        else {
            console.warn('Unknown data type received:', data);
        }
    }
}