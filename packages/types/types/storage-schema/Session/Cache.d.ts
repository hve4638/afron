export interface Cache {
    input: string;
    output: string;
    input_token_count: number;
    last_history: unknown | null;
    state: string;
    markdown: boolean;
    upload_files: SessionUploadFile[] | null;
}

interface SessionUploadFile {
    filename: string;
    data: string;
    size: number;
    type: 'image/webp' | 'image/png' | 'image/jpeg' | 'application/pdf' | 'text/plain' | string;
    thumbnail: string | null;
    hash_sha256: string;
}