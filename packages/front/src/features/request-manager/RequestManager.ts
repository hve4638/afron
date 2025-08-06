import RequestAPI from "@/api/request";
import ProfilesAPI, { SessionAPI } from "@/api/profiles";
import { useSessionStore } from "@/stores";
import useToastStore from "@/stores/useToastStore";
import { emitEvent } from "@/hooks/useEvent";

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

    private async handleResponse(chId: string, sessionAPI: SessionAPI) {
        {
            sessionAPI.set('cache.json', { 'state': 'loading' })
            const sessionState = useSessionStore.getState();
            if (sessionState.deps.last_session_id === sessionAPI.id) {
                sessionState.refetch.state();
            }
            emitEvent('refresh_session_metadata');
        }

        let normalExit = false;
        while (true) {
            const data = await RequestAPI.response(chId);
            console.log('Received data:', data);

            if (data === null || data.type === 'close') {
                console.warn('Request closed:', data);
                const sessionState = useSessionStore.getState();

                if (normalExit) break;
                await sessionAPI.set('cache.json', {
                    'state': 'done',
                });
                emitEvent('refresh_session_metadata');
                if (sessionState.deps.last_session_id === sessionAPI.id) {
                    sessionState.refetch.state();
                }
                emitEvent('refresh_session_metadata');
                break;
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
                switch (data.reason_id) {
                    case 'no_result':
                        console.warn('No result received from request:', data);
                        const sessionState = useSessionStore.getState();
                        if (sessionState.deps.last_session_id === sessionAPI.id) {
                            sessionState.refetch.state();
                        }
                        emitEvent('refresh_session_metadata');
                        break;
                    case 'request_failed':
                        useToastStore.getState().add(
                            '요청이 실패했습니다',
                            data.detail[0],
                            'error'
                        );
                        break;
                    case 'aborted':
                        useToastStore.getState().add(
                            '요청이 중단되었습니다',
                            data.detail[0],
                            'info'
                        );
                        break;
                    case 'fetch_failed':
                        useToastStore.getState().add(
                            '요청이 실패했습니다',
                            data.detail[0],
                            'error'
                        );
                        break;
                    case 'http_error':
                        useToastStore.getState().add(
                            '요청이 실패했습니다',
                            data.detail[0],
                            'error'
                        );
                        break;
                    case 'invalid_model':
                        useToastStore.getState().add(
                            '유효하지 않은 모델입니다',
                            data.detail[0],
                            'error'
                        );
                        break;
                    case 'other':
                        useToastStore.getState().add(
                            '오류가 발생했습니다',
                            data.detail[0],
                            'error'
                        );
                        break;
                    case 'prompt_build_failed':
                        useToastStore.getState().add(
                            '프롬프트 빌드에 실패했습니다',
                            data.detail[0],
                            'error'
                        );
                        break;
                    case 'prompt_execute_failed':
                        useToastStore.getState().add(
                            '프롬프트 실행에 실패했습니다',
                            data.detail[0],
                            'error'
                        );
                        break;
                    case 'response_failed_with_http_error':
                        useToastStore.getState().add(
                            '응답에 실패했습니다',
                            data.detail[0],
                            'error'
                        );
                        break;
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
            else {
                console.warn('Unknown data type received:', data);
            }
        }
    }
}

export default RequestManager;