import { FastifyInstance } from 'fastify';
import runtime from '@/runtime';
import ThrottleAction from '@/features/throttle-action';
import { route } from '@/utils/route';

export default async function(app: FastifyInstance) {
    const throttle = ThrottleAction.getInstance();

    app.get('/api/profiles/:profileId/sessions/:sessionId/form/:rtId', route(async (params) => {
        const profile = await runtime.profiles.getProfile(params['profileId']);
        return profile.session(params['sessionId']).getFormValues(params['rtId']);
    }));

    app.put('/api/profiles/:profileId/sessions/:sessionId/form/:rtId', route(async (params, body) => {
        const profile = await runtime.profiles.getProfile(params['profileId']);
        const session = profile.session(params['sessionId']);
        session.setFormValues(params['rtId'], body.values);
        throttle.saveProfile(profile);
    }));
}
