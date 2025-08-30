import { Profile } from '@/features/profiles';
import NoLogger from '@/features/nologger';
import { UnZipper } from '@/lib/unzipper'

import { RTPackFailed, RTUnpackFailed } from '../errors';
import { RTPackV1 } from './types';
import { LevelLogger } from '@/types';

export class RTUnpackerV1 {
    protected logger: LevelLogger;
    #profile: Profile;
    #importPath?: string;

    constructor(profile: Profile, logger?: LevelLogger) {
        this.#profile = profile;
        this.logger = logger ?? NoLogger.instance;
    }

    importPath(importPath: string): this {
        this.#importPath = importPath;

        return this;
    }

    async unpack(): Promise<void> {
        if (!this.#importPath) throw new RTPackFailed("Import path is not set");

        const unzipper = await UnZipper.From(this.#importPath);

        if (!unzipper.has('metadata.json')) {
            throw new RTUnpackFailed("metadata.json is missing");
        }

        const metadata: RTPackV1.Metadata = unzipper.getJSON<RTPackV1.Metadata>('metadata.json');
        if (metadata.class === 'rt-pack') {
            if (metadata.version !== 0) {
                throw new RTUnpackFailed("Unsupported metadata version");
            }

            this.#unpackRTPack(unzipper);
        }
        else {
            throw new RTUnpackFailed("Invalid metadata class");
        }
    }

    async #unpackRTPack(unzipper: UnZipper): Promise<void> {
        if (!unzipper.has('index.json')) {
            throw new RTUnpackFailed("index.json is missing");
        }

        const { mode }: RTPackV1.Index = unzipper.getJSON('index.json');

        if (mode === 'prompt_only') {
            this.#unpackRTPackPromptOnly(unzipper);
        }
        else {
            throw new RTUnpackFailed(`'${mode}' mode is not implemented yet`);
        }
    }

    async #unpackRTPackPromptOnly(unzipper: UnZipper): Promise<void> {
        if (
            !unzipper.has('prompts/default.json')
            || !unzipper.has('form.json')
        ) {
            throw new RTUnpackFailed("prompts/default.json is missing");
        }

        const newRtId = await this.#profile.generateRTId();

        const rtIndex: RTPackV1.Index = unzipper.getJSON('index.json');
        const form: RTPackV1.Form = unzipper.getJSON('form.json');
        const rtPrompts: RTPackV1.Prompt = unzipper.getJSON('prompts/default.json');

        await this.#profile.createUsingTemplate({
            id: newRtId,
            mode: rtIndex.mode,
            name: rtIndex.name,
        }, 'empty');
        const {
            uuid,
            forms,
            version,
            input_type
        } = rtIndex;

        const rt = this.#profile.rt(newRtId);
        await rt.raw.setIndex({
            input_type,
            version,
            forms,
            uuid: uuid!,
        });
        await rt.raw.setForm(form);
        await rt.raw.setPrompt('default', rtPrompts);
        await rt.setPromptName('default', rtIndex.name);

        this.logger.info(`RT '${rtIndex.name}' unpacked successfully as '${newRtId}'`);
    }
}

export default RTUnpackerV1;
