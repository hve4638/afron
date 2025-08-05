export class ChatAIFetcherFailed extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ChatAIFetcherFailed";
    }
}