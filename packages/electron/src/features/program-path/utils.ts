import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { app } from 'electron';
import { personal } from 'win-known-folders';

/** 
 * 기본 afron 유저데이터 저장 위치 리턴
*/
export function getDefaultSavePath(): string {
    const platform = os.platform();

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
    if (docu) {
        const legacyPath = path.join(docu, 'Afron');
        if (fs.existsSync(docu)) {
            return legacyPath;
        }
    }

    return path.join(app.getPath('documents'), 'Afron');
}