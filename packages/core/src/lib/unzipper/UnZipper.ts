import { unzipSync } from 'fflate';
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
    /** 디렉토리 여부 */
    isDirectory: boolean;
}

/**
 * UnZipper 옵션 설정
 */
export interface UnZipperOptions {
    /** 파일 크기 제한 (바이트 단위, 기본값: 10MB) */
    fileSizeLimit?: number;
}

/**
 * ZIP 파일 압축 해제 클래스
 * 작은 압축 파일을 대상으로 하며, 생성자 호출 시 모든 파일을 메모리에 캐싱합니다.
 */
export class UnZipper {
    private zipPath: string;
    private options: Required<UnZipperOptions>;
    private fileCache: Map<string, Buffer> = new Map();

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
        instance.loadAllFiles();
        return instance;
    }

    /**
     * ZIP 파일의 모든 파일을 캐시에 로드합니다.
     * @throws {UnZipperError} 파일 로드 실패 또는 크기 제한 초과 시
     */
    private loadAllFiles(): void {
        let unzipped: Record<string, Uint8Array>;
        try {
            unzipped = unzipSync(fs.readFileSync(this.zipPath));
        } catch (error) {
            throw new UnZipperError(`Failed to parse ZIP file: ${(error as Error).message}`);
        }

        for (const [fileName, content] of Object.entries(unzipped)) {
            // 디렉토리 엔트리는 건너뜀
            if (fileName.endsWith('/')) {
                continue;
            }

            if (content.length > this.options.fileSizeLimit) {
                throw new UnZipperError(
                    `File '${fileName}' exceeds size limit: ${content.length} bytes > ${this.options.fileSizeLimit} bytes`
                );
            }

            this.fileCache.set(fileName, Buffer.from(content));
        }
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

            for (const [fileName, content] of this.fileCache) {
                const outputPath = path.join(outputDirPath, fileName);
                const fileDir = path.dirname(outputPath);

                // 파일 디렉토리 생성
                if (!fs.existsSync(fileDir)) {
                    fs.mkdirSync(fileDir, { recursive: true });
                }

                // 파일 쓰기
                fs.writeFileSync(outputPath, content);
                extractedFiles.push(fileName);
            }

            return extractedFiles;
        } catch (error) {
            throw new UnZipperError(`Failed to extract all files to ${outputDirPath}: ${(error as Error).message}`);
        }
    }

    /**
     * ZIP 파일에서 특정 파일을 지정된 경로에 추출합니다.
     * @param filename - 추출할 파일명 (ZIP 내 경로)
     * @param outputFilePath - 저장할 파일 경로
     * @throws {UnZipperError} 파일이 존재하지 않거나 추출 실패 시
     */
    extract(filename: string, outputFilePath: string): void {
        const content = this.fileCache.get(filename);
        if (content === undefined) {
            throw new UnZipperError(`File not found in archive: ${filename}`);
        }

        try {
            const outputDir = path.dirname(outputFilePath);

            // 출력 디렉토리 생성
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            // 파일 쓰기
            fs.writeFileSync(outputFilePath, content);
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
        const content = this.fileCache.get(fileName);
        if (content === undefined) {
            throw new UnZipperError(`File not found in archive: ${fileName}`);
        }

        return content.toString('utf-8');
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
        const content = this.fileCache.get(fileName);
        if (content === undefined) {
            throw new UnZipperError(`File not found in archive: ${fileName}`);
        }

        return Buffer.from(content);
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
