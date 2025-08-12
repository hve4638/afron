import RequestAPI from "@/api/request";
import ProfilesAPI, { SessionAPI } from "@/api/profiles";
import { useSessionStore } from "@/stores";
import { emitEvent } from "@/hooks/useEvent";
import useErrorLogStore from "@/stores/useErrorLogStore";
import { getHttpStatusMessage } from "@/utils/status_code";

class RequestManager {
    static instance: RequestManager | null = null;

    static getInstance() {
        if (!RequestManager.instance) {
            RequestManager.instance = new RequestManager();
        }
        return RequestManager.instance;
    }

    private constructor() {

    }

    async request(profileId: string, sessionId: string) {
        const sessionAPI = ProfilesAPI.profile(profileId).session(sessionId);

        RequestAPI.request(profileId, sessionId)
            .then((chId) => {
                this.handleResponse(chId, sessionAPI);
            })
    }

    async preview(profileId: string, sessionId: string) {
        const sessionAPI = ProfilesAPI.profile(profileId).session(sessionId);

        RequestAPI.preview(profileId, sessionId)
            .then((chId) => {
                this.handleResponse(chId, sessionAPI);
            })
    }

    private async handleResponse(chId: string, sessionAPI: SessionAPI) {
        {
            sessionAPI.set('cache.json', { 'state': 'loading' })
            const sessionState = useSessionStore.getState();
            if (sessionState.deps.last_session_id === sessionAPI.id) {
                sessionState.refetch.state();
            }
            emitEvent('refresh_session_metadata');
        }

        const { add: addErrorLog } = useErrorLogStore.getState();

        while (true) {
            const data = await RequestAPI.response(chId);
            // console.info('$ Received data:', data);

            if (data === null || data.type === 'close') {
                console.warn('Request closed:', data);
                const sessionState = useSessionStore.getState();

                await sessionAPI.set('cache.json', {
                    'state': 'done',
                });
                emitEvent('refresh_session_metadata');
                if (sessionState.deps.last_session_id === sessionAPI.id) {
                    sessionState.refetch.state();
                }
                break;
            }
            else if (data.type === 'send_raw_request_preview') {
                emitEvent('show_rt_preview', data.preview);
            }
            else if (data.type === 'update') {
                for (const typeName of data.update_types) {
                    if (typeName === 'input') {
                        const sessionState = useSessionStore.getState();
                        if (sessionState.deps.last_session_id === sessionAPI.id) {
                            await sessionState.refetch.input();
                            await sessionState.actions.refetchInputFiles();
                            emitEvent('refresh_input');
                        }
                    }
                    else if (typeName === 'output') {
                        const sessionState = useSessionStore.getState();
                        if (sessionState.deps.last_session_id === sessionAPI.id) {
                            sessionState.refetch.output();
                            sessionState.refetch.state();
                        }
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
                        const sessionState = useSessionStore.getState();
                        if (sessionState.deps.last_session_id === sessionAPI.id) {
                            sessionState.refetch.state();
                        }
                        emitEvent('refresh_session_metadata');

                        addErrorLog({
                            message: '요청 결과가 없습니다',
                            detail: data.detail,
                            occurredAt: {
                                type: 'session',
                                sessionId: sessionAPI.id,
                            },
                        });
                        break;
                    case 'request_failed':
                        {
                            const errorId = addErrorLog({
                                message: `요청 실패`,
                                detail: data.detail,
                                occurredAt: {
                                    type: 'session',
                                    sessionId: sessionAPI.id,
                                },
                            });
                            emitEvent('show_toast_message', {
                                clickAction: {
                                    action: 'open_error_log',
                                    error_id: errorId,
                                },
                                title: '요청이 실패했습니다',
                                description: data.detail[0],
                                type: 'error',
                            });
                            break;
                        }
                    case 'aborted':
                        emitEvent('show_toast_message', {
                            title: '요청을 중단했습니다',
                            description: '',
                            type: 'info',
                            clickAction: {
                                action: 'none',
                            },
                        });
                        // no error log
                        break;
                    case 'fetch_failed':
                        {
                            const errorId = addErrorLog({
                                message: `요청 실패: fetch failed`,
                                detail: data.detail,
                                occurredAt: {
                                    type: 'session',
                                    sessionId: sessionAPI.id,
                                },
                            });
                            emitEvent('show_toast_message', {
                                title: '요청이 실패했습니다',
                                description: '',
                                type: 'error',
                                clickAction: {
                                    action: 'open_error_log',
                                    error_id: errorId,
                                }
                            });
                            break;
                        }
                    case 'http_error':
                        {
                            const code = data.http_status;;
                            const message = getHttpStatusMessage(code);

                            const errorId = addErrorLog({
                                message: `요청 실패: ${code} ${message}`,
                                detail: data.detail,
                                occurredAt: {
                                    type: 'session',
                                    sessionId: sessionAPI.id,
                                },
                            });
                            emitEvent('show_toast_message', {
                                title: '요청이 실패했습니다',
                                description: `${code} ${message}`,
                                type: 'error',
                                clickAction: {
                                    action: 'open_error_log',
                                    error_id: errorId,
                                }
                            });
                            break;
                        }
                    case 'invalid_model':
                        {
                            const errorId = addErrorLog({
                                message: `유효하지 않은 모델`,
                                detail: data.detail,
                                occurredAt: {
                                    type: 'session',
                                    sessionId: sessionAPI.id,
                                },
                            });
                            emitEvent('show_toast_message', {
                                title: '유효하지 않은 모델입니다',
                                description: data.detail[0],
                                type: 'error',
                                clickAction: {
                                    action: 'open_error_log',
                                    error_id: errorId,
                                }
                            });
                            break;
                        }
                    case 'other':
                        {
                            emitEvent('show_toast_message', {
                                title: '오류가 발생했습니다',
                                description: data.detail[0],
                                type: 'error',
                                clickAction: {
                                    action: 'none',
                                }
                            });
                            break;
                        }
                    case 'prompt_build_failed':
                        {
                            const errorId = addErrorLog({
                                message: `프롬프트 빌드 실패`,
                                detail: data.detail,
                                occurredAt: {
                                    type: 'session',
                                    sessionId: sessionAPI.id,
                                },
                            });
                            emitEvent('show_toast_message', {
                                title: '프롬프트 빌드에 실패했습니다',
                                description: data.detail[0],
                                type: 'error',
                                clickAction: {
                                    action: 'open_error_log',
                                    error_id: errorId,
                                }
                            });
                            break;
                        }
                    case 'prompt_execute_failed':
                        {
                            const errorId = addErrorLog({
                                message: `프롬프트 평가 실패`,
                                detail: data.detail,
                                occurredAt: {
                                    type: 'session',
                                    sessionId: sessionAPI.id,
                                },
                            });
                            emitEvent('show_toast_message', {
                                title: '프롬프트 평가에 실패했습니다',
                                description: data.detail[0],
                                type: 'error',
                                clickAction: {
                                    action: 'open_error_log',
                                    error_id: errorId,
                                }
                            });
                            break;
                        }
                    case 'env_error':
                        {
                            const errorId = addErrorLog({
                                message: data.title,
                                detail: data.detail,
                                occurredAt: {
                                    type: 'session',
                                    sessionId: sessionAPI.id,
                                },
                            });
                            emitEvent('show_toast_message', {
                                title: '환경 오류가 발생했습니다',
                                description: data.title,
                                type: 'fatal',
                                clickAction: {
                                    action: 'open_error_log',
                                    error_id: errorId,
                                }
                            });
                            break;
                        }
                }
            }
            else if (data.type === 'set_output') {
                await sessionAPI.set('cache.json', {
                    'output': data.text,
                    'state': 'done',
                });

                const sessionState = useSessionStore.getState();
                if (sessionState.deps.last_session_id === sessionAPI.id) {
                    sessionState.refetch.output();
                    sessionState.refetch.state();
                }
                emitEvent('refresh_session_metadata');
            }
            else if (data.type === 'stream_output') {

            }
            else if (data.type === 'send_info') {
                emitEvent('show_toast_message', {
                    title: data.title,
                    description: data.description,
                    type: 'info',
                    clickAction: {
                        action: 'open_info',
                        item: data.item,
                    }
                });
            }
            else {
                console.warn('Unknown data type received:', data);
            }
        }
    }
}

export default RequestManager;