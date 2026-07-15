import fs from 'fs';
import os from 'os';
import path from 'path';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { ZipBuilder } from './ZipBuilder';
import { UnZipper, UnZipperError } from '../unzipper';

describe('ZipBuilder ↔ UnZipper roundtrip', () => {
    let tmpDir: string;

    beforeAll(() => {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'zipper-test-'));
    });

    afterAll(() => {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    it('addText/addJson/addFile로 만든 zip을 다시 읽을 수 있다', async () => {
        const srcFile = path.join(tmpDir, 'src.bin');
        const binary = Buffer.from([0x00, 0x01, 0xff, 0x80]);
        fs.writeFileSync(srcFile, binary);

        const zipPath = path.join(tmpDir, 'roundtrip.zip');
        const builder = new ZipBuilder(zipPath);
        builder
            .addText('한글 텍스트', 'docs/readme.txt')
            .addJson({ mode: 'test', n: 1 }, 'index.json')
            .addFile(srcFile, 'assets/data.bin');
        await builder.build();

        expect(builder.built).toBe(true);
        expect(fs.existsSync(zipPath)).toBe(true);

        const unzipper = await UnZipper.From(zipPath);
        expect(unzipper.filenames().sort()).toEqual(['assets/data.bin', 'docs/readme.txt', 'index.json']);
        expect(unzipper.has('index.json')).toBe(true);
        expect(unzipper.has('missing.json')).toBe(false);
        expect(unzipper.getText('docs/readme.txt')).toBe('한글 텍스트');
        expect(unzipper.getJSON<{ mode: string; n: number }>('index.json')).toEqual({ mode: 'test', n: 1 });
        expect(unzipper.getBinary('assets/data.bin').equals(binary)).toBe(true);
    });

    it('extractAll로 원본 파일이 복원된다', async () => {
        const zipPath = path.join(tmpDir, 'extract.zip');
        const builder = new ZipBuilder(zipPath);
        builder.addText('nested', 'a/b/c.txt');
        await builder.build();

        const unzipper = await UnZipper.From(zipPath);
        const outDir = path.join(tmpDir, 'out');
        const extracted = unzipper.extractAll(outDir);

        expect(extracted).toEqual(['a/b/c.txt']);
        expect(fs.readFileSync(path.join(outDir, 'a/b/c.txt'), 'utf-8')).toBe('nested');
    });

    it('fileSizeLimit 초과 시 UnZipperError를 던진다', async () => {
        const zipPath = path.join(tmpDir, 'limit.zip');
        const builder = new ZipBuilder(zipPath);
        builder.addText('x'.repeat(1024), 'big.txt');
        await builder.build();

        await expect(UnZipper.From(zipPath, { fileSizeLimit: 100 })).rejects.toThrow(UnZipperError);
    });

    it('build() 이후 add·재빌드는 거부된다', async () => {
        const zipPath = path.join(tmpDir, 'sealed.zip');
        const builder = new ZipBuilder(zipPath);
        builder.addText('a', 'a.txt');
        await builder.build();

        expect(() => builder.addText('b', 'b.txt')).toThrow();
        await expect(builder.build()).rejects.toThrow();
    });

    it('존재하지 않는 zip 파일은 UnZipperError', async () => {
        await expect(UnZipper.From(path.join(tmpDir, 'nope.zip'))).rejects.toThrow(UnZipperError);
    });
});
