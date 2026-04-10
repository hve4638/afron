import { FastifyInstance } from 'fastify';
import registerHandlers from '@/handlers';

export async function initRoutes(app: FastifyInstance) {
    await registerHandlers(app);
}
