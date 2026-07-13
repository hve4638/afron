import os from 'os';
import si from 'systeminformation';
import { LevelLogger } from '@/types';
import NoLogger from '../nologger';

class UniqueIdentifier {
    static async makeAsSystemUUID():Promise<string> {
        const data = await si.uuid();
        return data.hardware;
    }
    
    static async makeAsHardwareNames(logger: LevelLogger = NoLogger.instance) {
        const totalStart = Date.now();
        const cpuStart = Date.now();
        const cpuBrand = (await si.cpu()).brand.trim().replaceAll(' ', '');
        const cpuDuration = Date.now() - cpuStart;
        logger.trace(`MasterKey.hardware: si.cpu done (ms=${cpuDuration})`);

        const boardStart = Date.now();
        const boardModel = (await si.baseboard()).model.trim().replaceAll(' ', '');
        const boardDuration = Date.now() - boardStart;
        logger.trace(`MasterKey.hardware: si.baseboard done (ms=${boardDuration})`);

        const hostname = os.hostname();
        const totalDuration = Date.now() - totalStart;
        logger.trace(`MasterKey.hardware: makeAsHardwareNames end (ms=${totalDuration})`);

        
        return `${cpuBrand}:${boardModel}:${hostname}`;
    }
}


export default UniqueIdentifier;