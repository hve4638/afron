import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import { ZipBuilderError } from './errors';

export class ZipBuilder {
    private archive: archiver.Archiver;
    private outputPath: string;
    private isBuilt: boolean = false;

    constructor(outputPath: string) {
        this.outputPath = outputPath;
        this.archive = archiver('zip', { zlib: { level: 9 } });
        
        // 에러 핸들링 설정
        this.archive.on('error', (err) => {
            throw new ZipBuilderError(`Archive error: ${err.message}`);
        });
    }

    addText(content: string, filePath: string): this {
        if (this.isBuilt) {
            throw new ZipBuilderError('Cannot add content after build() has been called');
        }

        try {
            this.archive.append(content, { name: filePath });
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
            this.archive.append(jsonContent, { name: filePath });
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

            this.archive.file(filePath, { name: zipPath });
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

        return new Promise<void>((resolve, reject) => {
            try {
                // 출력 디렉토리가 존재하지 않으면 생성
                const outputDir = path.dirname(this.outputPath);
                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, { recursive: true });
                }

                const output = fs.createWriteStream(this.outputPath);

                output.on('close', () => {
                    this.isBuilt = true;
                    resolve();
                });

                output.on('error', (err) => {
                    reject(new ZipBuilderError(`Output stream error: ${err.message}`));
                });

                this.archive.on('error', (err) => {
                    reject(new ZipBuilderError(`Archive error: ${err.message}`));
                });

                // 아카이브를 출력 스트림에 연결
                this.archive.pipe(output);

                // 아카이브 종료
                this.archive.finalize();
            } catch (error) {
                reject(new ZipBuilderError(`Build failed: ${(error as Error).message}`));
            }
        });
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