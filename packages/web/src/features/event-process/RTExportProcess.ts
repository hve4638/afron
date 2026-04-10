import sanitize from 'sanitize-filename';

import { RTPacker, GlobalEventEmitter, NoLogger } from '@afron/core';
import type { LevelLogger } from '@afron/core';
import runtime from '@/runtime';
import { GlobalEventData } from '@afron/types';

class RTExportProcess {
    #eventSender: (data: GlobalEventData) => unknown;
    protected logger: LevelLogger;

    constructor(eventSender: (data: GlobalEventData) => unknown, logger?: LevelLogger) {
        this.#eventSender = eventSender;
        this.logger = logger ?? NoLogger.instance;
    }

    async process(token: string, profileId: string, rtId: string, outputPath: string) {
        const emitter = new GlobalEventEmitter(token);
        emitter.on(this.#eventSender);

        const profile = await runtime.profiles.getProfile(profileId);

        try {
            emitter.emit.rtExport.ready();
            emitter.emit.rtExport.progress(0, 'exporting');

            await RTPacker.Packer(profile)
                .exportPath(outputPath)
                .reserveUUID(true)
                .rtId(rtId)
                .pack();

            emitter.emit.rtExport.done();
        }
        finally {
            emitter.emit.close();
        }
    }
}

export default RTExportProcess;
