import { FastifyInstance } from 'fastify';
import { route } from '@/utils/route';

/**
 * 하드웨어 가속은 Electron 전용 기능.
 * web에서는 stub으로 처리.
 */
export default async function(app: FastifyInstance) {
    app.get('/api/config/hardware-acceleration', route(async () => {
        return false;
    }));

    app.put('/api/config/hardware-acceleration', route(async () => {
        // no-op stub
    }));
}
