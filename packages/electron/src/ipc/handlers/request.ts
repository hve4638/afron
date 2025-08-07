import runtime from '@/runtime';

function handler(): IPCInvokerRequest {
    return {
        async requestRT(token: string, profileId: string, sessionId: string) {
            const profile = await runtime.profiles.getProfile(profileId);

            runtime.logger.info(`RT request (token=${token}, sessionId=${sessionId})`);
            await runtime.rtWorker.request(token, { profile, sessionId }, { preview: false });

            return [null] as const;
        },
        async previewPrompt(token: string, profileId: string, sessionId: string) {
            const profile = await runtime.profiles.getProfile(profileId);

            runtime.logger.info(`RT preview (token=${token}, sessionId=${sessionId})`);
            await runtime.rtWorker.request(token, { profile, sessionId }, { preview: true });

            return [null] as const;
        },
        async abort(token: string) {
            /// @TODO : 구현 필요

            throw new Error('Not implemented');
            return [null] as const;
        },
    }
}

export default handler;