import { v7 as uuidv7 } from 'uuid';
import { IACSubStorage } from 'ac-storage';
import { KeyValueInput, RTForm, ProfileStorage } from '@afron/types';
import { RTWorkflowControl } from './RTWorkflowControl';
import { RTPromptControl } from './RTPromptControl';

class ProfileRT {
    #workflowControl: RTWorkflowControl;
    #promptControl: RTPromptControl;

    constructor(private storage: IACSubStorage, private rtId: string) {
        this.#workflowControl = new RTWorkflowControl(storage, rtId);
        this.#promptControl = new RTPromptControl(storage, rtId);
    }

    get workflow() {
        return this.#workflowControl;
    }

    get prompt() {
        return this.#promptControl;
    }

    private async accessMetadata() {
        return await this.storage.accessAsJSON(`${this.rtId}:index.json`);
    }
    private async accessPrompt(promptId: string) {
        return await this.storage.accessAsJSON(`${this.rtId}:prompts:${promptId}`);
    }
    private async accessForm() {
        return await this.storage.accessAsJSON(`${this.rtId}:form.json`);
    }
    private async accessFlow() {
        return await this.storage.accessAsJSON(`${this.rtId}:flow.json`);
    }

    readonly raw = {
        getForm: async () => {
            const formAC = await this.accessForm();
            return formAC.getAll();
        },
        setForm: async (data: Record<string, RTForm>) => {
            const formAC = await this.accessForm();
            formAC.set(data);
        },

        getPrompt: async (promptId: string) => {
            const promptAC = await this.accessPrompt(promptId);
            return promptAC.getAll() as ProfileStorage.RT.Prompt;
        },
        setPrompt: async (promptId: string, data: ProfileStorage.RT.Prompt) => {
            const promptAC = await this.accessPrompt(promptId);
            return promptAC.set(data)
        },
        setIndex: async (input: Partial<ProfileStorage.RT.Index>) => {
            const indexAC = await this.accessMetadata();

            indexAC.set(input);
        }
    }

    async getForms(): Promise<RTForm[]> {
        const indexAC = await this.accessMetadata();
        const formAC = await this.accessForm();

        const formIds: string[] = indexAC.getOne('forms') ?? [];
        return formIds.map((formId) => {
            return formAC.getOne(formId);
        });
    }

    /** 버전 업데이트되며 누락된 필드 추가 */
    async fixMetadata() {
        const indexAC = await this.accessMetadata();
        const uuid = indexAC.getOne('uuid');

        if (!uuid) {
            indexAC.setOne('uuid', uuidv7());
        }
    }

    async getMetadata(): Promise<ProfileStorage.RT.Index> {
        const indexAC = await this.accessMetadata();

        return indexAC.get('version', 'id', 'name', 'uuid', 'mode', 'input_type', 'forms', 'entrypoint_node') as ProfileStorage.RT.Index;
    }
    async setMetadata(input: KeyValueInput): Promise<void> {
        const indexAC = await this.accessMetadata();

        indexAC.set(input);
    }


    async drop() {
        return await this.storage.dropDir(`${this.rtId}`);
    }
}

export default ProfileRT;