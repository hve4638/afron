import * as fs from 'node:fs';
import * as path from 'node:path';
import { app } from 'electron';

/**
 * [임시 - 경로 유실 디버그용, 원인 확인 후 제거]
 *
 * initPath는 winston 로거 초기화 이전에 실행되므로 앱 로그에 남길 수 없다.
 * 경로 resolve 자체를 의심하는 상황이므로, 존재가 확인된 위치인
 * appData/afron/path-debug.log 에 직접 append 한다
 */
const LOG_FILE = path.join(app.getPath('appData'), 'afron', 'path-debug.log');

export function pathDebug(...parts: unknown[]) {
    try {
        const text = parts
            .map(p => (typeof p === 'string' ? p : JSON.stringify(p)))
            .join(' ');
        const line = `${new Date().toISOString()} [PATH-DEBUG] ${text}\n`;

        fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
        fs.appendFileSync(LOG_FILE, line, 'utf-8');
    }
    catch {
        // 디버그 로그 실패는 앱 동작에 영향을 주지 않도록 무시
    }
}

export function pathDebugError(label: string, error: unknown) {
    const message = error instanceof Error
        ? `${error.name}: ${error.message}\n${error.stack ?? ''}`
        : String(error);

    pathDebug(label, message);
}
