import { FastifyRequest, FastifyReply } from 'fastify';
import runtime from '@/runtime';

type RouteHandler = (
    params: Record<string, string>,
    body: any,
    query: Record<string, string>,
    req: FastifyRequest,
    reply: FastifyReply,
) => Promise<any>;

/**
 * 라우트 핸들러 래퍼
 * - 성공: { data: result }
 * - 에러: { error: { name, message } }
 */
export function route(handler: RouteHandler) {
    return async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const result = await handler(
                req.params as any,
                req.body as any,
                req.query as any,
                req,
                reply,
            );
            if (reply.sent) return;
            return { data: result ?? null };
        }
        catch (error: any) {
            runtime.logger.error('Route error:', error);
            reply.status(400).send({
                error: {
                    name: error.name ?? 'Error',
                    message: error.message ?? 'Unknown error',
                },
            });
        }
    };
}
