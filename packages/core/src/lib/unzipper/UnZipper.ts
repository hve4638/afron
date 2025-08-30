import unzipper from 'unzipper';
import fs from 'fs';
import path from 'path';
import { UnZipperError } from './errors';

/**
 * ZIP 파일 내 파일 정보
 */
export interface FileInfo {
    /** 파일명 */
    name: string;
    /** 압축 해제된 파일 크기 (바이트) */
    size: number;
    /** 압축된 파일 크기 (바이트) */
    compressedSize: number;
    /** 디렉토리 여부 */
    isDirectory: boolean;
    /** 최종 수정 날짜 */
    lastModified: Date;
}

/**
 * UnZipper 옵션 설정
 */
export interface UnZipperOptions {
    /** 파일 크기 제한 (바이트 단위, 기본값: 10MB) */
    fileSizeLimit?: number;
}

/**
 * 캐시된 파일 데이터
 */
interface CachedFile {
    info: FileInfo;
    content: Buffer;
}

/**
 * ZIP 파일 압축 해제 클래스
 * 작은 압축 파일을 대상으로 하며, 생성자 호출 시 모든 파일을 메모리에 캐싱합니다.
 */
export class UnZipper {
    private zipPath: string;
    private options: Required<UnZipperOptions>;
    private fileCache: Map<string, CachedFile> = new Map();

    /**
     * UnZipper 인스턴스를 생성합니다.
     * @param zipPath - 처리할 ZIP 파일 경로
     * @param options - 옵션 설정
     */
    private constructor(zipPath: string, options?: UnZipperOptions) {
        this.zipPath = zipPath;
        this.options = {
            fileSizeLimit: options?.fileSizeLimit ?? 10 * 1024 * 1024 // 10MB 기본값
        };
    }

    /**
     * UnZipper 인스턴스를 생성합니다.
     * ZIP 파일의 모든 내용을 메모리에 캐싱합니다.
     * @param zipPath - 처리할 ZIP 파일 경로
     * @param options - 옵션 설정 (fileSizeLimit 기본값: 10MB)
     * @returns UnZipper 인스턴스
     * @throws {UnZipperError} ZIP 파일이 존재하지 않거나 캐싱 실패 시
     */
    static async From(zipPath: string, options?: UnZipperOptions): Promise<UnZipper> {
        if (!fs.existsSync(zipPath)) {
            throw new UnZipperError(`Zip file does not exist: ${zipPath}`);
        }

        const instance = new UnZipper(zipPath, options);
        await instance.loadAllFilesAsync();
        return instance;
    }

    /**
     * ZIP 파일의 모든 파일을 비동기적으로 캐시에 로드합니다.
     * @throws {UnZipperError} 파일 로드 실패 또는 크기 제한 초과 시
     */
    private async loadAllFilesAsync(): Promise<void> {
        return new Promise((resolve, reject) => {
            const fileEntries: { fileName: string; content: Buffer; info: FileInfo }[] = [];
            
            fs.createReadStream(this.zipPath)
                .pipe(unzipper.Parse())
                .on('entry', async (entry) => {
                    // 디렉토리는 건너뜀
                    if (entry.type === 'Directory') {
                        entry.autodrain();
                        return;
                    }
                    
                    const fileSize = entry.vars.uncompressedSize || 0;
                    
                    // 파일 크기 제한 확인
                    if (fileSize > this.options.fileSizeLimit) {
                        entry.autodrain();
                        reject(new UnZipperError(
                            `File '${entry.path}' exceeds size limit: ${fileSize} bytes > ${this.options.fileSizeLimit} bytes`
                        ));
                        return;
                    }
                    
                    const fileInfo: FileInfo = {
                        name: entry.path,
                        size: fileSize,
                        compressedSize: entry.vars.compressedSize || 0,
                        isDirectory: false,
                        lastModified: new Date(entry.vars.lastModifiedDateTime || 0)
                    };
                    
                    try {
                        const chunks: Buffer[] = [];
                        entry.on('data', (chunk) => chunks.push(chunk));
                        entry.on('end', () => {
                            const content = Buffer.concat(chunks);
                            fileEntries.push({ fileName: entry.path, content, info: fileInfo });
                        });
                        entry.on('error', (err) => {
                            reject(new UnZipperError(`Failed to read entry ${entry.path}: ${err.message}`));
                        });
                    } catch (error) {
                        entry.autodrain();
                        reject(new UnZipperError(`Failed to process entry ${entry.path}: ${(error as Error).message}`));
                    }
                })
                .on('error', (err) => {
                    reject(new UnZipperError(`Failed to parse ZIP file: ${err.message}`));
                })
                .on('close', () => {
                    try {
                        // 모든 파일을 캐시에 저장
                        for (const { fileName, content, info } of fileEntries) {
                            this.fileCache.set(fileName, { info, content });
                        }
                        resolve();
                    } catch (error) {
                        reject(new UnZipperError(`Failed to cache files: ${(error as Error).message}`));
                    }
                });
        });
    }

    /**
     * ZIP 파일의 모든 내용을 지정된 디렉토리에 추출합니다.
     * 캐시된 데이터를 사용하여 동기적으로 처리합니다.
     * @param outputDirPath - 추출할 대상 디렉토리 경로
     * @returns 추출된 파일 경로 목록
     * @throws {UnZipperError} 추출 실패 시
     */
    extractAll(outputDirPath: string): string[] {
        try {
            if (!fs.existsSync(outputDirPath)) {
                fs.mkdirSync(outputDirPath, { recursive: true });
            }

            const extractedFiles: string[] = [];
            
            for (const [fileName, cachedFile] of this.fileCache) {
                const outputPath = path.join(outputDirPath, fileName);
                const fileDir = path.dirname(outputPath);
                
                // 파일 디렉토리 생성
                if (!fs.existsSync(fileDir)) {
                    fs.mkdirSync(fileDir, { recursive: true });
                }
                
                // 파일 쓰기
                fs.writeFileSync(outputPath, cachedFile.content);
                extractedFiles.push(fileName);
            }
            
            return extractedFiles;
        } catch (error) {
            throw new UnZipperError(`Failed to extract all files to ${outputDirPath}: ${(error as Error).message}`);
        }
    }

    /**
     * ZIP 파일에서 특정 파일을 지정된 경로에 추출합니다.
     * 추출 전에 파일 크기를 확인합니다.
     * @param filename - 추출할 파일명 (ZIP 내 경로)
     * @param outputFilePath - 저장할 파일 경로
     * @throws {UnZipperError} 파일이 존재하지 않거나 추출 실패 시
     */
    extract(filename: string, outputFilePath: string): void {
        if (!this.fileCache.has(filename)) {
            throw new UnZipperError(`File not found in archive: ${filename}`);
        }

        const cachedFile = this.fileCache.get(filename)!;
        
        // 파일 크기 확인 (실제 불러오기 전에)
        if (cachedFile.info.size > this.options.fileSizeLimit) {
            throw new UnZipperError(
                `File '${filename}' exceeds size limit: ${cachedFile.info.size} bytes > ${this.options.fileSizeLimit} bytes`
            );
        }

        try {
            const outputDir = path.dirname(outputFilePath);
            
            // 출력 디렉토리 생성
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }
            
            // 파일 쓰기
            fs.writeFileSync(outputFilePath, cachedFile.content);
        } catch (error) {
            throw new UnZipperError(`Failed to extract file ${filename} to ${outputFilePath}: ${(error as Error).message}`);
        }
    }

    /**
     * ZIP 파일에서 텍스트 파일을 읽어 문자열로 반환합니다.
     * 캐시된 데이터를 사용하여 동기적으로 처리합니다.
     * @param fileName - 읽을 파일명 (ZIP 내 경로)
     * @returns 파일의 텍스트 내용 (UTF-8 인코딩)
     * @throws {UnZipperError} 파일이 존재하지 않는 경우
     */
    getText(fileName: string): string {
        if (!this.fileCache.has(fileName)) {
            throw new UnZipperError(`File not found in archive: ${fileName}`);
        }
        
        const cachedFile = this.fileCache.get(fileName)!;
        return cachedFile.content.toString('utf-8');
    }

    /**
     * ZIP 파일에서 JSON 파일을 읽어 객체로 파싱하여 반환합니다.
     * 캐시된 데이터를 사용하여 동기적으로 처리합니다.
     * @template T - 반환할 JSON 객체의 타입
     * @param fileName - 읽을 JSON 파일명 (ZIP 내 경로)
     * @returns 파싱된 JSON 객체
     * @throws {UnZipperError} 파일이 존재하지 않거나 JSON 파싱 실패 시
     */
    getJSON<T>(fileName: string): T {
        try {
            const content = this.getText(fileName);
            return JSON.parse(content) as T;
        } catch (error) {
            if (error instanceof UnZipperError) {
                throw error;
            }
            if (error instanceof SyntaxError) {
                throw new UnZipperError(`Invalid JSON in file ${fileName}: ${error.message}`);
            }
            throw new UnZipperError(`Failed to parse JSON from ${fileName}: ${(error as Error).message}`);
        }
    }

    /**
     * ZIP 파일에서 바이너리 파일을 읽어 Buffer로 반환합니다.
     * 캐시된 데이터를 사용하여 동기적으로 처리합니다.
     * @param fileName - 읽을 파일명 (ZIP 내 경로)
     * @returns 파일의 바이너리 데이터
     * @throws {UnZipperError} 파일이 존재하지 않는 경우
     */
    getBinary(fileName: string): Buffer {
        if (!this.fileCache.has(fileName)) {
            throw new UnZipperError(`File not found in archive: ${fileName}`);
        }
        
        const cachedFile = this.fileCache.get(fileName)!;
        return Buffer.from(cachedFile.content);
    }

    /**
     * ZIP 파일에 특정 파일이 존재하는지 확인합니다.
     * 캐시된 데이터를 사용하여 즉시 반환합니다.
     * @param fileName - 확인할 파일명 (ZIP 내 경로)
     * @returns 파일 존재 여부
     */
    has(fileName: string): boolean {
        return this.fileCache.has(fileName);
    }

    /**
     * ZIP 파일 내의 모든 파일 경로 목록을 반환합니다.
     * 캐시된 데이터를 사용하여 즉시 반환합니다.
     * @returns 파일 경로 문자열 배열
     */
    filenames(): string[] {
        return Array.from(this.fileCache.keys());
    }
}