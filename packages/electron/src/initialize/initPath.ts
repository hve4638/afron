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
        programPath = ProgramPath.FromDefaultPath();
        
        config.set('save_path', programPath.basePath);
        config.save();
    }
    else {
        programPath = ProgramPath.From(savePath);
    }
    programPath.makeRequiredDirectory();
    
    return {
        programPath,
    };
}