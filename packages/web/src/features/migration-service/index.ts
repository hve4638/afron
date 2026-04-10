import type { Profiles } from '@afron/core';

/**
 * Web 환경에서는 레거시 데이터 마이그레이션을 지원하지 않음.
 * 인터페이스 호환을 위한 스텁 구현.
 */
class MigrationService {
    existsLegacyData(): boolean {
        return false;
    }

    async migrate(_profiles: Profiles, _data: any): Promise<void> {
        // no-op
    }

    async extract(): Promise<null> {
        return null;
    }

    setMigrated(): void {
        // no-op
    }
}

export default MigrationService;
