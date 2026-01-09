import { SessionAPI } from '@/api/profiles';
import { emitEvent } from '@/hooks/useEvent';
import { useSessionStore } from '@/stores';
import { SessionState } from '@/stores/useSessionStore';

export class SessionTool {
    #token: string;
    #sessionAPI: SessionAPI;

    constructor(token: string, sessionAPI: SessionAPI) {
        this.#token = token;
        this.#sessionAPI = sessionAPI;
    }

    /**
     * 현재 RT work 세션의 상태 변경
    */
    async changeState(state: 'loading' | 'idle' | 'error' | 'done') {
        const sessionStore = useSessionStore.getState();
        const runningRT = { ...sessionStore.running_rt };

        if (state === 'idle' || state === 'done') {
            delete runningRT[this.#token];
        }
        else {
            runningRT[this.#token] = {
                token: this.#token,
                state: state,
                created_at: Date.now(),
            };
        }

        console.log('#', runningRT);
        sessionStore.update.running_rt(runningRT);
    }

    async setOutput(output: string) {
        await this.#sessionAPI.set('cache.json', {
            'output': output,
            'state': 'done',
        });
    }

    #isCurrent(sessionState: SessionState) {
        return sessionState.deps.last_session_id === this.#sessionAPI.id
    }

    /**
     * 이 세션이 활성화된 세션이라면
     * backend의 state 변경 사항을 반영하기 위해 refetch
    */
    async refetchIfCurrent() {
        const sessionState = useSessionStore.getState();
        if (this.#isCurrent(sessionState)) {
            await sessionState.refetch.state();
        }
    }

    /**
     * 이 세션이 활성화된 세션이라면
     * backend의 변경 사항을 반영하기 위해 refetch
     * 
     * input 파일은 별도로 refetchInputFiles() 호출
    */
    async refetchInputIfCurrent() {
        const sessionState = useSessionStore.getState();
        if (this.#isCurrent(sessionState)) {
            await sessionState.refetch.input();
            await sessionState.actions.refetchInputFiles();
            emitEvent('refresh_input');
        }
    }

    /**
     * 이 세션이 활성화된 세션이라면
     * backend의 output, state 변경 사항을 반영하기 위해 refetch
    */
    async refetchOutputIfCurrent() {
        const sessionState = useSessionStore.getState();
        if (this.#isCurrent(sessionState)) {
            await sessionState.refetch.output();
            await sessionState.refetch.state();
        }
    }

    /**
     * 채팅창 레이아웃 세션이 아닌 경우 효과없음
     */
    async refreshChat() {
        const sessionState = useSessionStore.getState();
        if (this.#isCurrent(sessionState)) {
            emitEvent('refresh_chat');
        }
    }
}