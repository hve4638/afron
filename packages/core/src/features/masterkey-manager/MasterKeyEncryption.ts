import { Gen1, IEncryptModel } from './encrypt-model';
import { LevelLogger } from '@/types';
import NoLogger from '@/features/nologger';


class MasterKeyEncryptUtil {
    private encryptModel: IEncryptModel;
    private encryptedAsHardwareKey: string | null = null;
    
    constructor(private masterKey: string, logger: LevelLogger = NoLogger.instance) {
        this.encryptModel = new Gen1(logger);
    }

    async encrypt(key:string): Promise<string> {
        this.encryptedAsHardwareKey ??= await this.encryptModel.encrypt(this.masterKey, key);

        return this.encryptedAsHardwareKey;
    }

    
}


export default MasterKeyEncryptUtil;