import { Profile } from '@/features/profiles';

import { RTPackerV1, RTUnpackerV1 } from './v1';
import { LevelLogger } from '@/types';

class RTPacker {
    private constructor() { }

    static Packer(profile: Profile, logger?: LevelLogger) {
        return new RTPackerV1(profile, logger);
    }

    static Unpacker(profile: Profile, logger?: LevelLogger) {
        return new RTUnpackerV1(profile, logger);
    }
}

export default RTPacker;