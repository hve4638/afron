import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import Fastify from 'fastify';
import fastifyWebsocket from '@fastify/websocket';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import initialize from './initialize/initialize';
import { initRoutes } from './initialize/initRoutes';
import runtime from './runtime';
import { WebSocketManager } from './websocket';
import { RTEventData } from '@afron/types';

async function main() {
    // core 초기화
    await initialize();

    const app = Fastify({
        logger: runtime.env.dev,
    });

    // WebSocket 플러그인
    await app.register(fastifyWebsocket);

    // Multipart (RT import 시 .afrt 파일 업로드용)
    const multipart = (await import('@fastify/multipart')).default;
    await app.register(multipart, {
        limits: {
            fileSize: 50 * 1024 * 1024, // 50MB — .afrt는 ZIP이므로 보통 수 MB 이하
            files: 1,
        },
    });

    // WebSocket 엔드포인트
    app.register(async function (fastify) {
        fastify.get('/ws', { websocket: true }, (socket, req) => {
            WebSocketManager.getInstance().add(socket);
            runtime.logger.info('WebSocket client connected');
        });
    });

    // RTWorker 이벤트 → WebSocket 브릿지
    runtime.rtWorker.addRTEventListener((event: RTEventData) => {
        WebSocketManager.getInstance().broadcast({
            channel: 'request',
            chId: event.id,
            data: event,
        });
    });

    // API 라우트 등록
    await initRoutes(app);

    // 정적 파일 서빙 (front 빌드 결과물)
    const staticPath = path.resolve(__dirname, '../static');
    try {
        const fastifyStatic = (await import('@fastify/static')).default;
        await app.register(fastifyStatic, {
            root: staticPath,
            prefix: '/',
        });

        // SPA fallback
        app.setNotFoundHandler((req, reply) => {
            if (req.url.startsWith('/api/') || req.url.startsWith('/ws')) {
                reply.status(404).send({ error: { name: 'NotFound', message: 'Not found' } });
            }
            else {
                reply.sendFile('index.html');
            }
        });
    }
    catch {
        runtime.logger.info('Static file serving disabled (no @fastify/static or no static directory)');
    }

    // CORS (개발 시)
    if (runtime.env.dev) {
        try {
            const cors = (await import('@fastify/cors')).default;
            await app.register(cors, {
                origin: true,
            });
        }
        catch {
            runtime.logger.info('CORS disabled (no @fastify/cors)');
        }
    }

    // 서버 시작
    const port = runtime.env.port;
    const host = '0.0.0.0';

    await app.listen({ port, host });
    runtime.logger.info(`Afron web server listening on http://${host}:${port}`);
    console.log(`Afron web server listening on http://localhost:${port}`);
}

main().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
