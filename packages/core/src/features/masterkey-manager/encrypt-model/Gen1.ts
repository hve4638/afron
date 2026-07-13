import crypto from 'crypto';
import { AES } from '@/lib/crypt-wrapper';
import { v4 as uuidv4 } from 'uuid';
import { IEncryptModel } from './types';
import { LevelLogger } from '@/types';
import NoLogger from '@/features/nologger';

const MODEL_GEN = 1;
const STATIC_SALT = 'AFRON';
const SIGNITURE = 'AFRON_';
class EncryptModelGen1 implements IEncryptModel {
    constructor(private logger: LevelLogger = NoLogger.instance) {}

    async generateKey() {
        return uuidv4().trim();
    }
    
    async encrypt(target:string, encKey:string):Promise<string> {
        const encryptKey = crypto.scryptSync(encKey, STATIC_SALT, 32);
        const aes = new AES(encryptKey);
        const enc = aes.encrypt(`${SIGNITURE}${target}`);
        
        // <버전>:<IV>:<암호화>
        const result = `${MODEL_GEN}:${enc.iv}:${enc.data}`;
        return result;
    }

    async decrypt(encryptedData:string, decKey:string):Promise<string> {
        const decryptStart = Date.now();
        try {
            console.log(`MasterKey.decrypt: start`, this.logger.instanceId);

            const [genVersion, iv, encrypted] = encryptedData.split(':');
            const scryptStart = Date.now();
            const decryptKey = crypto.scryptSync(decKey, STATIC_SALT, 32);
            const scryptDuration = Date.now() - scryptStart;
            this.logger.trace(`MasterKey.decrypt: scryptSync done (ms=${scryptDuration})`);

            const aes = new AES(decryptKey);
            const plainText = aes.decrypt(encrypted, iv);
            if (plainText.startsWith(SIGNITURE)) {
                return plainText.slice(SIGNITURE.length);
            }
            else {
                throw new Error('Invalid data');
            }
        }
        finally {
            const decryptDuration = Date.now() - decryptStart;
            this.logger.trace(`MasterKey.decrypt: total end (ms=${decryptDuration})`);

        }
    }
}



export default EncryptModelGen1;