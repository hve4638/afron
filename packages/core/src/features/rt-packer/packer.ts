import { Profile } from '@/features/profiles';

import { RTPackerV1 } from './v1';

class RTPacker {
    Packer(profile: Profile) {
        return new RTPackerV1(profile);
    }
}

export default RTPacker;