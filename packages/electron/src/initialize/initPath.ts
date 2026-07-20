import * as fs from 'node:fs';
import * as path from 'node:path';

import UniqueStore from '@/features/unique-store';
import ProgramPath from '@/features/program-path';
import { GlobalStore } from '@/features/global-store';

/**
 * 저장 경로를 확보하고 ProgramPath를 준비
 */
export function initPath() {
    const config = GlobalStore.config();

    const savePath = config.get('save_path');
    let programPath: ProgramPath;
    if (savePath == null) {
        // 0.11 이하는 저장 경로를 UniqueStore(afron.config.json)에 두었으므로 값을 이관
        const legacySavePath = UniqueStore.instance().getSavePath();

        programPath = legacySavePath != null
            ? ProgramPath.From(legacySavePath)
            : ProgramPath.FromDefaultPath();

        config.set('save_path', programPath.basePath);
        config.save();
    }
    else {
        const rescuedPath = rescueLegacySavePath(savePath);
        if (rescuedPath != null) {
            programPath = ProgramPath.From(rescuedPath);

            config.set('save_path', rescuedPath);
            config.save();
        }
        else {
            programPath = ProgramPath.From(savePath);
        }
    }
    programPath.makeRequiredDirectory();

    return {
        programPath,
    };
}

/**
 * [임시 - 0.13에서 제거 예정] 0.12.0 커스텀 저장 경로 유실 구제
 *
 * 0.12.0이 UniqueStore의 savePath를 이관하지 않고 기본 경로를 save_path로 기록해,
 * 커스텀 저장 경로 사용자의 데이터가 유실된 것처럼 보이는 상태를 복구한다.
 * 현재 save_path에 프로필 데이터가 없고 구버전 설정의 경로에는 있는 경우에만 그쪽을 채택
 */
function rescueLegacySavePath(savePath: string): string | null {
    if (hasProfileData(savePath)) return null;

    const legacySavePath = UniqueStore.instance().getSavePath();
    if (legacySavePath == null || legacySavePath === savePath) return null;
    if (!hasProfileData(legacySavePath)) return null;

    return legacySavePath;
}

/**
 * 해당 저장 경로에 실제 프로필 데이터가 있는지 검사
 *
 * profiles.json은 프로필이 0개여도 종료 시 기록되므로 존재 여부가 아닌 내용으로 판단한다
 */
function hasProfileData(basePath: string): boolean {
    const metadataPath = path.join(basePath, 'profiles', 'profiles.json');
    try {
        const parsed = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));

        return Array.isArray(parsed.profiles) && parsed.profiles.length > 0;
    }
    catch {
        return false;
    }
}