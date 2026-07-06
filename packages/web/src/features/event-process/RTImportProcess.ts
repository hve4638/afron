import { RTPacker, GlobalEventEmitter, NoLogger } from '@afron/core';
import type { LevelLogger } from '@afron/core';
import runtime from '@/runtime';
import { GlobalEventData } from '@afron/types';

class RTImportProcess {
    #eventSender: (data: GlobalEventData) => unknown;
    protected logger: LevelLogger;

    constructor(eventSender: (data: GlobalEventData) => unknown, logger?: LevelLogger) {
        this.#eventSender = eventSender;
        this.logger = logger ?? NoLogger.instance;
    }

    async process(token: string, profileId: string, importPath: string) {
        const emitter = new GlobalEventEmitter(token);
        emitter.on(this.#eventSender);

        this.logger.debug('RTImportProcess started');

        // getProfile 실패도 failed/close 이벤트로 클라이언트에 전달돼야 하므로 try 안에서 수행
        try {
            emitter.emit.rtImport.ready();

            const profile = await runtime.profiles.getProfile(profileId);
            await RTPacker.Unpacker(profile, this.logger)
                .importPath(importPath)
                .unpack();

            this.logger.debug(`successfully load request template '${importPath}'`);
            emitter.emit.rtImport.done();
        }
        catch (e) {
            emitter.emit.rtImport.failed();
        }
        finally {
            emitter.emit.close();
        }

        this.logger.debug('RTImportProcess done');
    }
}

export default RTImportProcess;
