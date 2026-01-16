import UniqueStore from '@/features/unique-store';
import ProgramPath from '@/features/program-path';

export function initPath() {
    const uniqueStore = UniqueStore.instance();

    let savePath = uniqueStore.getSavePath();
    if (savePath === null) {
        uniqueStore.setSavePathAsDefault();
        savePath = uniqueStore.getSavePath() as string;
    }
    
    const programPath = new ProgramPath(savePath);
    programPath.makeRequiredDirectory();
    
    return {
        uniqueStore,
        programPath,
    };
}