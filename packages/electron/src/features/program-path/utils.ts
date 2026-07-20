import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { app } from 'electron';
import { personal } from 'win-known-folders';
import { pathDebug } from '@/utils/pathDebug';

/**
 * 기본 afron 유저데이터 저장 위치 리턴
*/
export function getDefaultSavePath(): string {
    const platform = os.platform();
    pathDebug('getDefaultSavePath: platform =', platform);

    switch (platform) {
        case 'win32':
            return getWindowsDefaultSavePath();
        case 'darwin':
            return path.join(app.getPath('documents'), 'Afron');
        case 'linux':
            try {
                return path.join(app.getPath('documents'), '.afron');
            }
            catch (error) {
                console.log(error);
                return path.join(os.homedir(), '.afron');
            }
        default:
            return path.join(os.homedir(), '.afron');
    }
}

function getWindowsDefaultSavePath(): string {
    const docu = personal('cp949');
    pathDebug('getWindowsDefaultSavePath: personal(cp949) =', docu ?? '(null)');
    if (docu) {
        const legacyPath = path.join(docu, 'Afron');
        if (fs.existsSync(docu)) {
            pathDebug('getWindowsDefaultSavePath: using', legacyPath);
            return legacyPath;
        }
    }

    const fallback = path.join(app.getPath('documents'), 'Afron');
    pathDebug('getWindowsDefaultSavePath: fallback to', fallback);
    return fallback;
}