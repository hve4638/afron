import * as fs from 'node:fs';
import * as path from 'node:path';
import { getDefaultSavePath } from './utils';

class ProgramPath {
    static From(basePath: string) {
        return new ProgramPath(basePath);
    }

    static FromDefaultPath() {
        return ProgramPath.From(getDefaultSavePath());
    }

    #basePath: string;
    private constructor(basePath: string) {
        this.#basePath = basePath;
    }
    
    get basePath() {
        return this.#basePath;
    }

    get profilePath() {
        return path.join(this.#basePath, 'profiles');
    }

    get testPath() {
        return path.join(this.#basePath, 'test');
    }

    get logPath() {
        return path.join(this.#basePath, 'logs');
    }

    makeRequiredDirectory() {
        fs.mkdirSync(this.basePath, { recursive: true });
        fs.mkdirSync(this.profilePath, { recursive: true });
        fs.mkdirSync(this.logPath, { recursive: true });
    }
}

export default ProgramPath;