import Channel from '@hve/channel';

class Latch {
    #released = false;
    #channel: Channel<0>;

    constructor() {
        this.#channel = new Channel<0>();
    }

    async wait(): Promise<void> {
        if (this.#released) return;
        await this.#channel.consume();
    }
    async release() {
        if (this.#released) return;
        this.#released = true;
        await this.#channel.produce(0);
    }
}

export default Latch;