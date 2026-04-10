import { FastifyInstance } from 'fastify';
import ThrottleAction from '@/features/throttle-action';
import runtime from '@/runtime';
import { route } from '@/utils/route';

export default async function(app: FastifyInstance) {
    const throttle = ThrottleAction.getInstance();

    app.get('/api/storage/:identifier', route(async (params, _body, query) => {
        const identifier = params['identifier'];
        const keys = (query['keys'] as string)?.split(',') ?? [];
        const accessor = await runtime.globalStorage.accessAsJSON(identifier);
        return accessor.get(...keys);
    }));

    app.put('/api/storage/:identifier', route(async (params, body) => {
        const identifier = params['identifier'];
        const accessor = await runtime.globalStorage.accessAsJSON(identifier);
        accessor.set(body.data);
        throttle.saveGlobal();
    }));
}
