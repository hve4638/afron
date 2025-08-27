import { IRTPackMetadata } from './types';
import { Profile } from '@/features/profiles';
import { RTPackFailed } from '../errors';
import { ZipBuilder, ZipBuilderError } from '@/lib/zipper';

const RTPACK_VERSION = 0;

export class RTPackerV1 {
    #profile: Profile;
    #rtId?: string;
    #exportPath?: string;
    #reserveUUID?: boolean;

    constructor(profile: Profile) {
        this.#profile = profile;
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

    async #packPromptOnly(rtMetadata: RTIndex): Promise<void> {
        try {
            const metadata: IRTPackMetadata = {
                class: 'rt-pack',
                packVersion: RTPACK_VERSION,
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

    async #packFlow(rtMetadata: RTIndex): Promise<void> {
        throw new RTPackFailed(`'${rtMetadata.mode}' mode is not implemented yet`);
    }

    async #prepareIndexData(rtMetadata: RTIndex): Promise<any> {
        const indexData = { ...rtMetadata };

        if (!this.#reserveUUID) {
            delete (indexData as any).uuid;
        }
        delete (indexData as any).id;

        return indexData;
    }

    async #prepareFormData(rtMetadata: RTIndex): Promise<Record<string, any>> {
        if (!rtMetadata.form || rtMetadata.form.length === 0) {
            return {};
        }

        const rt = this.#profile.rt(this.#rtId!);
        const forms = await rt.getForms();

        // form 데이터를 formId를 키로 하는 객체로 구성
        const formData: Record<string, any> = {};

        // metadata.form에 존재하는 form만 포함
        for (const formId of rtMetadata.form) {
            const form = forms.find(f => f.id === formId);
            if (form) {
                formData[formId] = form;
            }
        }

        return formData;
    }

    async #preparePrompt(promptId: string): Promise<StorageStruct.RT.Prompt> {
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
