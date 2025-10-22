import { RTPackV1 } from './types';
import { Profile } from '@/features/profiles';
import { RTPackFailed } from '../errors';
import { ZipBuilder, ZipBuilderError } from '@/lib/zipper';
import { LevelLogger } from '@/types';
import NoLogger from '@/features/nologger';
import { ProfileStorage } from '@afron/types';

const RTPACK_VERSION = 0;

export class RTPackerV1 {
    protected logger: LevelLogger;
    #profile: Profile;
    #rtId?: string;
    #exportPath?: string;
    #reserveUUID?: boolean;

    constructor(profile: Profile, logger?: LevelLogger) {
        this.#profile = profile;
        this.logger = logger ?? NoLogger.instance;
    }

    rtId(rtId: string): this {
        this.#rtId = rtId;
        return this;
    }

    exportPath(exportPath: string): this {
        this.#exportPath = exportPath;
        return this;
    }

    reserveUUID(enabled: boolean): this {
        this.#reserveUUID = enabled;
        return this;
    }

    async pack(): Promise<void> {
        if (!this.#rtId) throw new RTPackFailed("RT ID is not set");
        if (!this.#exportPath) throw new RTPackFailed("Export path is not set");
        if (this.#reserveUUID === undefined) throw new RTPackFailed("Reserve UUID is not set");

        const rt = this.#profile.rt(this.#rtId);
        await rt.fixMetadata();
        const rtMetadata = await rt.getMetadata();

        if (rtMetadata.mode === 'prompt_only') {
            await this.#packPromptOnly(rtMetadata);
        } else {
            await this.#packFlow(rtMetadata);
        }
    }

    async #packPromptOnly(rtMetadata: ProfileStorage.RT.Index): Promise<void> {
        try {
            const metadata: RTPackV1.Metadata = {
                class: 'rt-pack',
                version: RTPACK_VERSION,
                createdAt: Math.floor(Date.now() / 1000),
            };

            const zipBuilder = new ZipBuilder(this.#exportPath!);

            zipBuilder.addJson(metadata, 'metadata.json');

            const indexData = await this.#prepareIndexData(rtMetadata);
            zipBuilder.addJson(indexData, 'index.json');

            const formData = await this.#prepareFormData(rtMetadata);
            zipBuilder.addJson(formData, 'form.json');

            const promptData = await this.#preparePrompt('default');
            zipBuilder.addJson(promptData, 'prompts/default.json');

            await zipBuilder.build();
        }
        catch (error) {
            if (error instanceof ZipBuilderError) {
                throw new RTPackFailed(`Zip build failed: ${error.message}`);
            }
            throw new RTPackFailed(`Pack failed: ${(error as Error).message}`);
        }
    }

    async #packFlow(rtMetadata: ProfileStorage.RT.Index): Promise<void> {
        throw new RTPackFailed(`'${rtMetadata.mode}' mode is not implemented yet`);
    }

    async #prepareIndexData(rtIndex: ProfileStorage.RT.Index): Promise<RTPackV1.Index> {
        const {
            version,
            mode,
            name,
            uuid,
            input_type,
            entrypoint_node,
            forms,
        } = rtIndex;

        return {
            version,
            mode,
            name,
            uuid: this.#reserveUUID ? uuid : null,
            input_type,
            entrypoint_node,
            forms,
        };
    }

    async #prepareFormData(rtIndex: ProfileStorage.RT.Index): Promise<RTPackV1.Form> {
        if (!rtIndex.forms || rtIndex.forms.length === 0) {
            return {};
        }

        const rt = this.#profile.rt(this.#rtId!);
        const form = await rt.raw.getForm();

        const formData: Record<string, any> = {};
        for (const formId of rtIndex.forms) {
            formData[formId] = form[formId];
        }

        return formData;
    }

    async #preparePrompt(promptId: string): Promise<RTPackV1.Prompt> {
        const rt = this.#profile.rt(this.#rtId!);
        const promptData = await rt.getPromptStruct(promptId);

        return {
            id: promptId,
            name: promptData.name,
            model: promptData.model,
            variables: promptData.variables ?? [],
            constants: promptData.constants ?? [],
            contents: promptData.contents ?? '',
        };
    }
}
