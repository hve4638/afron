
export type VersionInfo = {
    name: string;
    url: string;
    version: string;
    semver: StructuredVersion;
    description: string;

    prerelease: boolean;
    isNewer: boolean;
}
export type StructuredVersion = {
    isSemver: true;
    major: number;
    minor: number;
    patch: number;
    tag?: string;
} | {
    isSemver: false;
    identifier: string;
    tag: string;
};

export type RequestRTData = {
    type: 'result'
    text: string;
    response: unknown;
} | {
    type: 'no_result' // result is not available, but the process is complete
} | {
    type: 'stream';
    text: string;
} | {
    type: 'error';
    message: string;
    detail: string[];
} | {
    type: 'output_clear';
} | {
    type: 'input_update';
} | {
    type: 'history_update';
} | {
    type: 'close';
}

export type HistoryMetadata = {
    id: number;
    requestType: 'chat' | 'normal';
    createdAt: number;
    bookmark: boolean;

    rtId: string;
    rtUUID: string;
    modelId: string;

    form: Record<string, unknown>;

    isComplete: boolean;
}

export type HistoryMessage = {
    id: number;
    input?: string;
    output?: string;
}

export type HistorySearch = {
    text: string;
    searchScope: 'any' | 'input' | 'output';
}

export type VertexAIAuth = {
    project_id: string;
    private_key: string;
    client_email: string;
}

export type UploadableFileType = 'image/webp' | 'image/png' | 'image/jpeg' | 'application/pdf' | 'text/plain';

export type InputFileMetadata = {
    filename: string;
    size: number; // bytes
    type: UploadableFileType;
    hash_sha256: string;
}
export type InputFile = InputFileMetadata & {
    data: string;
    thumbnail: string | null;
}
export type InputFilePreview = InputFileMetadata & {
    thumbnail: string | null;
}

export type InputFilesUpdateInfo = {
    updated: InputFileMetadata[];
    removed: InputFileMetadata[];
}

export type InputFileHash = {
    hash_sha256: string;
}

/** 커스텀 모델 정의 */
export interface CustomModel {
    id: string;
    name: string;
    model: string;
    url: string;
    api_format: 'chat_completions' | 'generative_language' | 'anthropic_claude';
    thinking: boolean;
    secret_key?: string;
}
export type CustomModelCreate = Omit<CustomModel, 'id'> & { id?: string };