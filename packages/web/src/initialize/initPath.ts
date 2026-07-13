import ProgramPath from '@/features/program-path';
import runtime from '@/runtime';

/**
 * 저장 경로를 확보하고 ProgramPath를 준비
 */
export function initPath() {
    const dataDir = runtime.env.dataDir;

    let programPath: ProgramPath;
    if (dataDir) {
        programPath = ProgramPath.From(dataDir);
    }
    else {
        programPath = ProgramPath.FromDefaultPath();
    }

    programPath.makeRequiredDirectory();

    return { programPath };
}
