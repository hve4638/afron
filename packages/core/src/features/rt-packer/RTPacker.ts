import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import { IRTPackMetadata } from './types';

const RTPACK_VERSION = 0;

export class RTPacker {
    static async pack(sourceDir: string, outPath: string): Promise<void> {
        const metadata: IRTPackMetadata = {
            packVersion: RTPACK_VERSION,
            rtVersion: '1.0.0',
            createdAt: Math.floor(Date.now() / 1000),
        };

        const output = fs.createWriteStream(outPath);
        const archive = archiver('zip', {
            zlib: { level: 9 },
        });

        return new Promise((resolve, reject) => {
            output.on('close', () => {
                resolve();
            });

            archive.on('error', (err) => {
                reject(err);
            });

            archive.pipe(output);
            
            archive.append(JSON.stringify(metadata, null, 2), { name: 'metadata.json' });

            const dirName = path.basename(sourceDir);
            archive.directory(sourceDir, dirName);

            archive.finalize();
        });
    }
}
