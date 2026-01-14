
export interface Data {
    running_rt: Record<string, SessionRunningRTEntry>;
}

interface SessionCustomModel {
    name: string;
    url: string;
    api_format: 'chat_completions' | 'anthropic_claude' | 'generative_language';
    secret_key: string | null;
}

interface SessionRunningRTEntry {
    token: string;
    created_at: number;
    state: string;
}