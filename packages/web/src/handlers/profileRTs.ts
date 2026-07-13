import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { v7 as uuidv7 } from 'uuid';
import { FastifyInstance } from 'fastify';
import { RTPacker } from '@afron/core';
import * as utils from '@/utils';
import runtime from '@/runtime';
import { type Profile } from '@afron/core';
import { route } from '@/utils/route';

/** RT 트리에서 id로 노드를 재귀 탐색 (디렉토리 → children까지) */
function findRTNode(tree: any[], id: string): { name: string; id: string } | undefined {
    for (const item of tree) {
        if (item.type === 'node' && item.id === id) return item;
        if (item.type === 'directory' && Array.isArray(item.children)) {
            const found = item.children.find((n: any) => n.id === id);
            if (found) return found;
        }
    }
    return undefined;
}

export default async function(app: FastifyInstance) {
    const throttles = {};

    const saveProfile = (profile: Profile) => {
        const throttleId = `profile_${profile.path}`;
        throttles[throttleId] ??= utils.throttle(500);
        throttles[throttleId](() => {
            profile.commit();
        });
    }

    app.get('/api/profiles/:profileId/rts', route(async ({ profileId }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        return await profile.getRTTree();
    }));

    app.put('/api/profiles/:profileId/rts', route(async ({ profileId }, { tree }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        profile.updateRTTree(tree);
        saveProfile(profile);
    }));

    app.post('/api/profiles/:profileId/rts', route(async ({ profileId }, { metadata }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        await profile.addRT(metadata);
        saveProfile(profile);
    }));

    app.delete('/api/profiles/:profileId/rts/:rtId', route(async ({ profileId, rtId }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        profile.removeRT(rtId);
        saveProfile(profile);
    }));

    app.post('/api/profiles/:profileId/rts/generate-id', route(async ({ profileId }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        return await profile.generateRTId();
    }));

    app.get('/api/profiles/:profileId/rts/:rtId/exists', route(async ({ profileId, rtId }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        return await profile.hasRTId(rtId);
    }));

    app.put('/api/profiles/:profileId/rts/:rtId/id', route(async ({ profileId, rtId }, { newRTId }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        profile.changeRTId(rtId, newRTId);
        saveProfile(profile);
    }));

    app.post('/api/profiles/:profileId/rts/from-template', route(async ({ profileId }, { metadata, templateId }) => {
        const profile = await runtime.profiles.getProfile(profileId);
        await profile.createUsingTemplate(metadata, templateId);
    }));

    // ── RT Import (multipart file upload) ─────────────────

    // Electron의 dialog.showOpenDialog() 대체
    // 브라우저에서 multipart로 .afrt 파일을 업로드하면,
    // 임시 파일에 저장 후 RTImportProcess에 경로를 전달한다.
    // 진행 이벤트는 WebSocket(global 채널)으로 전송된다.
    // token은 /api/request와 동일하게 클라이언트가 생성해 넘긴다.
    // (서버가 token을 발급하면 클라이언트가 채널을 등록하기 전에 이벤트가 유실될 수 있음)
    app.post('/api/profiles/:profileId/rts/import', async (req, reply) => {
        const { profileId } = req.params as { profileId: string };
        const { token } = req.query as { token?: string };

        if (!token) {
            return reply.status(400).send({
                error: { name: 'ValidationError', message: 'No token provided' },
            });
        }

        const file = await req.file();
        if (!file) {
            return reply.status(400).send({
                error: { name: 'ValidationError', message: 'No file uploaded' },
            });
        }

        // 임시 파일에 저장
        const tmpPath = path.join(os.tmpdir(), `afron-import-${uuidv7()}.afrt`);
        await pipeline(file.file, fs.createWriteStream(tmpPath));

        // 업로드 크기 초과 시 (truncated)
        if (file.file.truncated) {
            fs.unlink(tmpPath, () => {});
            return reply.status(413).send({
                error: { name: 'PayloadTooLarge', message: 'File size exceeds limit' },
            });
        }

        // 즉시 응답하고 import는 비동기로 실행, 결과는 WS 이벤트로 전달
        runtime.eventProcess.RTImportProcess()
            .process(token, profileId, tmpPath)
            .catch((error: any) => {
                runtime.logger.error(`RT import process failed: ${error?.message ?? error}`);
            })
            .finally(() => {
                fs.unlink(tmpPath, () => {}); // 임시 파일 정리
            });

        return { data: null };
    });

    // ── RT Export (file download) ─────────────────────────

    // Electron의 dialog.showSaveDialog() 대체
    // 서버에서 .afrt 파일을 pack한 후 HTTP 파일 다운로드로 응답한다.
    // WebSocket 이벤트 없이 단일 HTTP 응답으로 완결되므로 progress modal 불필요.
    app.get('/api/profiles/:profileId/rts/:rtId/export', async (req, reply) => {
        const { profileId, rtId } = req.params as { profileId: string; rtId: string };

        const profile = await runtime.profiles.getProfile(profileId);
        const tmpPath = path.join(os.tmpdir(), `afron-export-${uuidv7()}.afrt`);

        try {
            await RTPacker.Packer(profile)
                .exportPath(tmpPath)
                .reserveUUID(true)
                .rtId(rtId)
                .pack();

            // RT 이름으로 다운로드 파일명 생성
            // 트리는 (Node | Directory)[] 2단계 구조이므로 directory.children까지 탐색
            const rtTree = await profile.getRTTree();
            const rtNode = findRTNode(rtTree, rtId);
            const sanitize = (await import('sanitize-filename')).default;
            const filename = sanitize(rtNode?.name ?? rtId).replace(/"/g, '_') + '.afrt';

            reply.header('Content-Type', 'application/octet-stream');
            // RFC 5987: ASCII fallback + UTF-8 인코딩으로 헤더 인젝션 방지
            reply.header('Content-Disposition',
                `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`);

            const stream = fs.createReadStream(tmpPath);
            // 'close'는 end/error 어느 쪽이든 마지막에 한 번만 발생한다
            stream.on('close', () => fs.unlink(tmpPath, () => {}));

            return reply.send(stream);
        }
        catch (error: any) {
            fs.unlink(tmpPath, () => {});
            reply.status(400).send({
                error: { name: error.name ?? 'ExportError', message: error.message },
            });
        }
    });
}
