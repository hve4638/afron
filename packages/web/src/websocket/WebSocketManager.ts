import type { WebSocket } from 'ws';

export type WsMessage = {
    channel: 'request' | 'global' | 'debug';
    chId: string;
    data: any;
};

class WebSocketManager {
    static #instance: WebSocketManager | null = null;
    #clients = new Set<WebSocket>();

    private constructor() {}

    static getInstance() {
        this.#instance ??= new WebSocketManager();
        return this.#instance;
    }

    add(ws: WebSocket) {
        this.#clients.add(ws);
        ws.on('close', () => this.#clients.delete(ws));
    }

    broadcast(message: WsMessage) {
        const data = JSON.stringify(message);
        for (const client of this.#clients) {
            if (client.readyState === 1) { // WebSocket.OPEN
                client.send(data);
            }
        }
    }
}

export default WebSocketManager;
