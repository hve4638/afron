import { RTForm, ProfileStorage } from "@afron/types";

export namespace RTPackV1 {
    export interface Metadata {
        class: 'rt-pack';
        version: 0;
        createdAt: number;
    }

    export interface Index {
        version: string;
        mode: 'prompt_only' | 'flow';
        name: string;
        uuid: string | null;
        input_type: 'normal' | 'chat';
        entrypoint_node?: unknown;
        forms: string[];
    }

    export type Form = Record<string, RTForm>;

    export type Prompt = ProfileStorage.RT.Prompt;
}


export interface IRTPackMetadata {
    class: 'rt-pack';
    version: 0;
    createdAt: number;
}
