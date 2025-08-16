import type { Profile } from '@/features/profiles';
import type { LevelLogger } from '@/types';

import { WorkflowPromptOnly } from './workflow';
import RTEventEmitter, { RTEventListener } from './RTEventEmitter';
import NoLogger from '../nologger';
import RTWorkflow from './workflow/RTWorkflow';
import WorkflowPromptPreview from './workflow/WorkflowPromptPreview';

type WorkRequired = {
    profile: Profile;
    sessionId: string;
}

type WorkOptions = {
    /** 전송 전 데이터 미리 보기 모드, 단일 프롬프트 모드에서만 작동 */
    preview?: boolean;
}

class RTWorker {
    protected logger: LevelLogger;

    #tokens: Set<string> = new Set();
    #handlers: RTEventListener[];

    constructor(handlers: RTEventListener[], logger?: LevelLogger) {
        this.#handlers = [...handlers];
        this.logger = logger ?? NoLogger.instance;
    }

    async addRTEventListener(handler: RTEventListener): Promise<void> {
        this.#handlers.push(handler);
    }

    async request(token: string, { profile, sessionId }: WorkRequired, { preview = false }: WorkOptions): Promise<string> {
        // 토큰 중복 여부 검사
        // 토큰은 동기화 문제 때문에 frontend에서 받아오므로 항상 검증 필요
        if (this.#tokens.has(token)) {
            this.logger.error(`RTWork failed: duplicate token`, token);

            throw new Error(`Duplicate token: ${token}`);
        }
        this.#tokens.add(token);
        this.logger.trace(`RT request started (${token})`)

        // RTWorkflow 필요 데이터 생성
        const session = profile.session(sessionId);
        const { rt_id, model_id } = await session.get('config.json', ['rt_id', 'model_id']);
        const { input, upload_files } = await session.get('cache.json', ['input', 'upload_files']);
        const form = await session.getOne('data.json', `forms.${rt_id}`);
        const rtInput: RTInput = {
            rtId: rt_id,
            modelId: model_id,
            sessionId: sessionId,
            form: form ?? {},
            input: input ?? '',
            inputFiles: upload_files ?? [],
            chat: [],
        }

        // emitter 핸들러 등록
        const emitter = new RTEventEmitter(token, this.logger);
        emitter.on(this.#handlers[0]);

        // 옵션에 따라 입력 필드 비우기
        const configAC = await profile.accessAsJSON('config.json');
        const { clear_on_submit_normal, clear_on_submit_chat } = configAC.get('clear_on_submit_normal', 'clear_on_submit_chat');
        const { input_type } = await profile.rt(rt_id).getMetadata();
        if (
            (input_type === 'normal' && clear_on_submit_normal)
            || (input_type === 'chat' && clear_on_submit_chat)
        ) {
            session.set('cache.json', { input: '', upload_files: [] });
            emitter.emit.update.input();
        }

        let process: RTWorkflow;
        if (preview) {
            process = new WorkflowPromptPreview(emitter, profile);
        }
        else {
            process = new WorkflowPromptOnly(emitter, profile);
        }
        process.process(rtInput)
            .then(() => {
                this.logger.info(`RT request completed (${token})`);
            })
            .catch((error) => {
                this.logger.info(`RT request failed (${token})`);
                this.logger.error(`RT request error:`, error);
            })
            .finally(() => {
                emitter.emit.directive.close();

                this.#tokens.delete(token);
            });

        return token;
    }
}

export default RTWorker;