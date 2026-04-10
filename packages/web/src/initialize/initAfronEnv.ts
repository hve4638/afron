import dotenv from 'dotenv';
import { AfronEnv } from '@/runtime/types';
import { updateRegistry } from '@/runtime';

/** 환경변수 구성 */
export function initAfronEnv() {
    dotenv.config();

    const env: AfronEnv = {
        dev: ENV.boolean('DEV'),
        inMemory: ENV.boolean('IN_MEMORY'),
        skipMasterKeyInitialization: ENV.boolean('SKIP_MASTER_KEY_INITAILIZATION'),
        defaultProfile: ENV.boolean('DEFAULT_PROFILE'),
        defaultRT: ENV.boolean('DEFAULT_RT'),
        logTrace: ENV.boolean('LOG_TRACE'),
        logVerbose: ENV.boolean('LOG_VERBOSE'),
        port: ENV.number('PORT') ?? 3700,
        dataDir: ENV.str('DATA_DIR') ?? '',
    };

    updateRegistry({ env });

    return { env };
}

class ENV {
    static str(envName: string): string | undefined {
        return process.env[`AFRON_${envName}`];
    }

    static boolean(envName: string): boolean {
        const envField = process.env[`AFRON_${envName}`] ?? '';
        return (
            envField === '1' ||
            envField.toUpperCase() == 'TRUE' ||
            envField.toUpperCase() == 'T'
        );
    }

    static number(envName: string): number | undefined {
        const envField = process.env[`AFRON_${envName}`];
        if (!envField) return undefined;
        const num = parseInt(envField, 10);
        return isNaN(num) ? undefined : num;
    }
}
