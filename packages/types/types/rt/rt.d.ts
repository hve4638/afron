import '../prompt-form';

export type RTMetadata = {
    name: string;
    id: string;
    mode: RTMode;
}

/** RT 트리 구조 */
export type RTMetadataTree = (
    RTMetadataNode | RTMetadataDirectory
)[];
export type RTMetadataNode = {
    type: 'node';
    name: string;
    id: string;
}
export type RTMetadataDirectory = {
    type: 'directory';
    name: string;
    children: RTMetadataNode[];
}


export declare namespace RTMetadatas {
    type Tree = (Node | Directory)[]
    type Node = {
        type: 'node';
        name: string;
        id: string;
    }
    type Directory = {
        type: 'directory';
        name: string;
        children: Node[];
    }
}


export type RTMode = 'prompt_only' | 'flow';

export type RTInput = {
    input: string;
    inputFiles: InputFile[];
    chat?: RTInputMessage[];

    form: Record<string, any>;
    modelId: string;
    rtId: string;
    sessionId: string;
}
export type RTInputMessage = {
    type: 'chat';
    message: RTInputMessagePart[];
}
export type RTInputMessagePart = {
    type: 'text' | 'image';
    value: string;
}

export { };