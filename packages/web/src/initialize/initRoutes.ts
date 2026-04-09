import { FastifyInstance } from 'fastify';
import getHandlers from '@/handlers';
import runtime from '@/runtime';

/**
 * handler의 [error, result] 튜플을 HTTP 응답으로 변환하여
 * 모든 IPC 핸들러를 POST /api/{category}/{method} 라우트로 등록
 */
export async function initRoutes(app: FastifyInstance) {
    const handlers = getHandlers();

    for (const category in handlers) {
        for (const method in handlers[category]) {
            const handler = handlers[category][method];

            app.post(`/api/${category}/${method}`, async (req, reply) => {
                const { args = [] } = req.body as { args?: any[] };

                runtime.logger.trace(`APICall: ${category}_${method}`, ...args);
                try {
                    const result = await handler(...args);

                    if (result[0]) {
                        const err = result[0];
                        reply.status(400).send({
                            error: {
                                name: err.name ?? 'Error',
                                message: err.message ?? 'Unknown error',
                            }
                        });
                    }
                    else {
                        reply.send({ data: result[1] ?? null });
                    }
                }
                catch (error: any) {
                    runtime.logger.error(`APIError: ${category}_${method}`, error);
                    reply.status(500).send({
                        error: {
                            name: error.name ?? 'InternalError',
                            message: error.message ?? 'Internal server error',
                        }
                    });
                }
            });
        }
    }
}
