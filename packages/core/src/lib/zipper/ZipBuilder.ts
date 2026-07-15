import { zipSync, strToU8, type Zippable } from 'fflate';
import fs from 'fs';
import path from 'path';
import { ZipBuilderError } from './errors';

export class ZipBuilder {
    private entries: Zippable = {};
    private outputPath: string;
    private isBuilt: boolean = false;

    constructor(outputPath: string) {
        this.outputPath = outputPath;
    }

    addText(content: string, filePath: string): this {
        if (this.isBuilt) {
            throw new ZipBuilderError('Cannot add content after build() has been called');
        }

        try {
            this.entries[filePath] = strToU8(content);
            return this;
        } catch (error) {
            throw new ZipBuilderError(`Failed to add text content to ${filePath}: ${(error as Error).message}`);
        }
    }

    addJson(obj: any, filePath: string, indent: number = 2): this {
        if (this.isBuilt) {
            throw new ZipBuilderError('Cannot add content after build() has been called');
        }

        try {
            const jsonContent = JSON.stringify(obj, null, indent);
            this.entries[filePath] = strToU8(jsonContent);
            return this;
        } catch (error) {
            throw new ZipBuilderError(`Failed to add JSON content to ${filePath}: ${(error as Error).message}`);
        }
    }

    addFile(filePath: string, zipPath: string): this {
        if (this.isBuilt) {
            throw new ZipBuilderError('Cannot add content after build() has been called');
        }

        try {
            if (!fs.existsSync(filePath)) {
                throw new ZipBuilderError(`File does not exist: ${filePath}`);
            }

            this.entries[zipPath] = new Uint8Array(fs.readFileSync(filePath));
            return this;
        } catch (error) {
            if (error instanceof ZipBuilderError) {
                throw error;
            }
            throw new ZipBuilderError(`Failed to add file ${filePath} to ${zipPath}: ${(error as Error).message}`);
        }
    }

    async build(): Promise<void> {
        if (this.isBuilt) {
            throw new ZipBuilderError('build() has already been called');
        }

        try {
            // 출력 디렉토리가 존재하지 않으면 생성
            const outputDir = path.dirname(this.outputPath);
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            const zipped = zipSync(this.entries, { level: 9 });
            fs.writeFileSync(this.outputPath, zipped);
            this.isBuilt = true;
        } catch (error) {
            if (error instanceof ZipBuilderError) {
                throw error;
            }
            throw new ZipBuilderError(`Build failed: ${(error as Error).message}`);
        }
    }

    /**
     * 빌드 상태 확인
     */
    get built(): boolean {
        return this.isBuilt;
    }

    /**
     * 출력 경로 반환
     */
    get output(): string {
        return this.outputPath;
    }
}
