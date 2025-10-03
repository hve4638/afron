import { SessionAPI } from '@/api/profiles';
import { emitEvent } from '@/hooks/useEvent';
import useErrorLogStore, { LogData } from '@/stores/useErrorLogStore';
import { getHttpStatusMessage } from '@/utils/status_code';

type RTEventErrorData = (
    RTEventData & {
        type: 'error';
    }
);

export class ErrorTool {
    #addErrorLog: (entry: LogData) => string;
    #sessionAPI: SessionAPI;
    #sessionId: string;

    constructor(sessionAPI: SessionAPI) {
        const { add: addErrorLog } = useErrorLogStore.getState();
        this.#addErrorLog = addErrorLog;
        this.#sessionAPI = sessionAPI;
        this.#sessionId = sessionAPI.id;
    }

    noResult(data: RTEventErrorData) {
        this.#addErrorLog({
            message: '요청 결과가 없습니다',
            detail: data.detail,
            occurredAt: {
                type: 'session',
                sessionId: this.#sessionId,
            },
        });
    }

    requestFailed(data: RTEventErrorData) {
        const errorId = this.#addErrorLog({
            message: `요청 실패`,
            detail: data.detail,
            occurredAt: {
                type: 'session',
                sessionId: this.#sessionId,
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
    }

    aborted(data: RTEventErrorData) {
        emitEvent('show_toast_message', {
            title: '요청을 중단했습니다',
            description: '',
            type: 'info',
            clickAction: {
                action: 'none',
            },
        });
    }

    fetchFailed(data: RTEventErrorData) {
        const errorId = this.#addErrorLog({
            message: `요청 실패: fetch failed`,
            detail: data.detail,
            occurredAt: {
                type: 'session',
                sessionId: this.#sessionId,
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
    }

    httpError(data: RTEventErrorData & { reason_id: 'http_error' }) {
        const code = data.http_status;
        const message = getHttpStatusMessage(code);

        const errorId = this.#addErrorLog({
            message: `요청 실패: ${code} ${message}`,
            detail: data.detail,
            occurredAt: {
                type: 'session',
                sessionId: this.#sessionId,
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
    }

    invalidModel(data: RTEventErrorData) {
        const errorId = this.#addErrorLog({
            message: `유효하지 않은 모델`,
            detail: data.detail,
            occurredAt: {
                type: 'session',
                sessionId: this.#sessionId,
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
    }

    other(data: RTEventErrorData) {
        emitEvent('show_toast_message', {
            title: '오류가 발생했습니다',
            description: data.detail[0],
            type: 'error',
            clickAction: {
                action: 'none',
            }
        });
    }

    promptBuildFailed(data: RTEventErrorData) {
        const errorId = this.#addErrorLog({
            message: `프롬프트 빌드 실패`,
            detail: data.detail,
            occurredAt: {
                type: 'session',
                sessionId: this.#sessionId,
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
    }

    promptExecuteFailed(data: RTEventErrorData) {
        const errorId = this.#addErrorLog({
            message: `프롬프트 평가 실패`,
            detail: data.detail,
            occurredAt: {
                type: 'session',
                sessionId: this.#sessionId,
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
    }

    envError(data: RTEventErrorData & { reason_id: 'env_error' }) {
        const errorId = this.#addErrorLog({
            message: data.title,
            detail: data.detail,
            occurredAt: {
                type: 'session',
                sessionId: this.#sessionId,
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
    }
}