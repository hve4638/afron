import { v7 as uuidv7 } from 'uuid';
import Channel from '@hve/channel';

import LocalAPI from '@/api/local';
import { EventPipeError } from './errors';

abstract class EventPipe<TData> {
    #bindId: number | null = null;
    #channels = new Map<string, Channel<TData>>();

    async register() {
        if (this.#bindId) return;

        const binded = this.onReceive.bind(this)
        this.#bindId = await this.connectEvent(binded);
    }

    protected onReceive(event: any, chId: string, data: TData) {
        const ch = this.#getCh(chId);

        ch.produce(data);
    }

    async unregister() {
        if (this.#bindId == null) return;

        await LocalAPI.events.off(this.#bindId);
        this.#bindId = null;
    }

    open() {
        let chId = uuidv7();
        while (this.#channels.get(chId)) {
            chId = uuidv7();
        }

        this.#channels.set(chId, new Channel<TData>());
        return chId;
    }

    /** open() 후 서버 요청이 실패하는 등 수신할 이벤트가 없어진 채널을 정리한다. */
    close(chId: string) {
        this.#closeCh(chId);
    }

    #getCh(chId: string) {
        const ch = this.#channels.get(chId);
        if (!ch) {
            throw new EventPipeError(`Channel is closed : '${chId}'`);
        }

        return ch;
    }

    #closeCh(chId: string) {
        // 대기 중인 consume()이 null로 풀리도록 채널 자체도 닫는다
        this.#channels.get(chId)?.close();
        this.#channels.delete(chId);
    }

    async receive(chId: string) {
        const ch = this.#getCh(chId);
        const result = await ch.consume();

        if (this.isClosedData(result)) {
            this.#closeCh(chId);
        }
        return result;
    }

    abstract connectEvent(callback: (event: any, chId: string, data: TData) => void): Promise<number>;
    abstract isClosedData(data: TData | null): boolean;
}

export default EventPipe;