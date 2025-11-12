import { dialog } from 'electron';
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

    async process(token: string, profileId: string, rtId: string) {
        const emitter = new GlobalEventEmitter(token);
        emitter.on(this.#eventSender);

        const profile = await runtime.profiles.getProfile(profileId);
        const { name } = await profile.rt(rtId).getMetadata();

        const filename = sanitize(name ?? 'untitled', { replacement: '_' });

        try {
            emitter.emit.rtExport.ready();
            const result = await dialog.showSaveDialog({
                filters: [
                    {
                        name: 'request template',
                        extensions: ['afrt']
                    }
                ],
                defaultPath: `${filename}.afrt`,
            });
            emitter.emit.rtExport.progress(0, 'test-notification');

            let filePath: string;
            if (!result.canceled && result.filePath) {
                filePath = result.filePath;
                console.log('선택된 파일:', filePath);
            }
            else {
                console.log('선택 취소됨');
                return;
            }

            await RTPacker.Packer(profile)
                .exportPath(filePath)
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