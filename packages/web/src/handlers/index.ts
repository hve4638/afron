import { FastifyInstance } from 'fastify';
import globalConfig from './globalConfig';
import general from './general';
import masterKey from './masterKey';
import globalStorage from './globalStorage';
import profiles from './profiles';
import profile from './profile';
import profileSessions from './profileSessions';
import profileSession from './profileSession';
import profileSessionHistory from './profileSessionHistory';
import profileStorage from './profileStorage';
import profileSessionStorage from './profileSessionStorage';
import profileRTs from './profileRTs';
import profileRT from './profileRT';
import profileRTStorage from './profileRTStorage';
import profileRTPrompt from './profileRTPrompt';
import profileRTFlow from './profileRTFlow';
import request from './request';

export default async function registerHandlers(app: FastifyInstance) {
    await app.register(globalConfig);
    await app.register(general);
    await app.register(masterKey);
    await app.register(globalStorage);
    await app.register(profiles);
    await app.register(profile);
    await app.register(profileStorage);
    await app.register(profileSession);
    await app.register(profileSessions);
    await app.register(profileSessionStorage);
    await app.register(profileSessionHistory);
    await app.register(profileRTs);
    await app.register(profileRT);
    await app.register(profileRTStorage);
    await app.register(profileRTPrompt);
    await app.register(profileRTFlow);
    await app.register(request);
}
