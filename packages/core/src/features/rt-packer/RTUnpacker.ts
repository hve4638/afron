import fs from 'fs';
import unzipper from 'unzipper';
import { IRTPackMetadata } from './types';

export class RTUnpacker {
    private zipPath: string;

    constructor(zipPath: string) {
        this.zipPath = zipPath;
    }
    
    async readMetadata(): Promise<IRTPackMetadata> {
        return new Promise((resolve, reject) => {
            fs.createReadStream(this.zipPath)
                .pipe(unzipper.Parse())
                .on('entry', (entry: unzipper.Entry) => {
                    if (entry.path === 'metadata.json') {
                        entry.buffer().then(buffer => {
                            try {
                                const metadata = JSON.parse(buffer.toString());
                                resolve(metadata);
                            } catch (error) {
                                reject(error);
                            }
                        });
                    } else {
                        entry.autodrain();
                    }
                })
                .on('error', reject);
        });
    }
    
    async unpack(outDir: string): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.createReadStream(this.zipPath)
                .pipe(unzipper.Extract({ path: outDir }))
                .on('close', resolve)
                .on('error', reject);
        });
    }
}
