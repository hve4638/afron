import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

class ProgramPath {
    static From(basePath: string) {
        return new ProgramPath(basePath);
    }

    static FromDefaultPath() {
        return ProgramPath.From(ProgramPath.getDefaultSavePath());
    }

    private static getDefaultSavePath(): string {
        const platform = os.platform();
        switch (platform) {
            case 'win32':
                return path.join(os.homedir(), 'Documents', 'Afron');
            case 'darwin':
                return path.join(os.homedir(), 'Documents', 'Afron');
            default:
                return path.join(os.homedir(), '.afron');
        }
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
