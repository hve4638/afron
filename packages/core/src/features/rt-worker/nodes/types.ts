import { type Profile } from '@/features/profiles';
import { HistoryMessageRow } from '@/features/acstorage-accessor';

import RTEventEmitter from '../RTEventEmitter';
import { HistoryMessageAddRequired } from '@/features/acstorage-accessor/HistoryAccessor/types';

export type HistoryData = {
    type: 'text' | 'image_url' | 'image_base64' | 'file_url' | 'file_base64';
    origin: 'in' | 'out';
    text?: string | null;
    data?: string | null;
    data_name?: string | null;
    data_type?: string | null;
    token_count: number;
};

export type NodeData = {
    rtEventEmitter: RTEventEmitter;
    profile: Profile;

    inputText: string;
    inputFiles: InputFile[];

    chat: ChatContents[];
    form: Record<string, any>;

    sessionId: string;
    modelId: string;
    rtId: string;
    create_at: number;

    data: {
        input: HistoryMessageAddRequired[];
        output: HistoryMessageAddRequired[];
        input_token_count: number;
        output_token_count: number;
    };
}

export type ChatContents = {
    role: 'user' | 'assistant';
    contents: {
        type: 'text',
        value: string
    }[]
}

export interface UserInput {
    text: string;
    files: InputFile[];
}