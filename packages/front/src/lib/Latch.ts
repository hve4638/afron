
// Channel을 이용한 비동기 래치(Latch) 구현
import Channel from '@hve/channel';


/**
 * 단일 시점의 해제 신호를 통해 여러 비동기 흐름을 제어할 수 있도록 하는 동기화 도구
 */
export class Latch {
    #released = false;
    #channel: Channel<0>;

    constructor() {
        // 채널 초기화
        this.#channel = new Channel<0>();
    }

    /**
     * release()가 호출될 때까지 대기
     * 
     * 최초 release 호춯 이후에는 즉시 반환
     */
    async wait(): Promise<void> {
        if (this.#released) return;
        await this.#channel.consume();
    }

    /**
     * 대기 중인 wait()을 모두 해제
     */
    async release() {
        if (this.#released) return;
        this.#released = true;
        await this.#channel.produce(0);
    }
}

export default Latch;