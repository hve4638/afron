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
        const profile = await runtime.profiles.getProfile(profileId);

        const emitter = new GlobalEventEmitter(token);
        emitter.on(this.#eventSender);

        this.logger.debug('RTImportProcess started');

        try {
            emitter.emit.rtImport.ready();

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
