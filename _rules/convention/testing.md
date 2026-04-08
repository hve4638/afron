# Test Conventions

## 테스트 프레임워크

- **Vitest** 사용 (Jest 호환 API)
- 테스트 설정: 각 패키지의 `jest.config.ts` (루트 + packages/core + packages/front + packages/electron)

---

## 테스트 파일 위치 및 네이밍

### 파일명
- `{SourceFile}.test.ts` 형식
- `.spec.ts`는 사용하지 않음
- 예: `Profile.test.ts`, `RTControl.test.ts`, `AES.test.ts`, `date.test.ts`

### 위치
- **소스 파일 옆에 배치** (co-located)
  ```
  features/profiles/Profile/Profile.ts
  features/profiles/Profile/Profile.test.ts
  features/profiles/Profile/rt/RTControl.test.ts
  ```
  ```
  lib/crypt-wrapper/AES.ts
  lib/crypt-wrapper/AES.test.ts
  ```
  ```
  utils/date.ts
  utils/date.test.ts
  ```
- 별도 `__tests__` 디렉토리는 사용하지 않음

### 테스트 헬퍼 위치
- `test/utils.ts` 형식으로 테스트 유틸리티 파일 관리
  ```
  features/acstorage-accessor/HistoryAccessor/test/utils.ts
  ```

---

## Import 패턴

### vitest에서 import
```typescript
import { describe, test, expect } from 'vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
```
- `test`와 `it` 모두 사용 (혼용됨)
- 동일 파일에서는 하나만 사용 (`test` 또는 `it`)

### 테스트 대상 import
```typescript
import Profile from './Profile';
import AES from './AES';
import ChatAIFetcher from './ChatAIFetcher';
import { formatDateLocal, formatDateUTC } from './date';
```
- 상대 경로로 직접 import

### Mock/Fixture import
```typescript
import { MockMasterKeyManager } from '@/features/masterkey-manager';
import { MemACStorage, StorageAccess } from 'ac-storage';
```
- Mock 클래스는 소스 패키지에서 직접 export (별도 mock 파일 아님)

---

## 테스트 구조

### describe/test 구조
```typescript
describe('Profile', () => {
    // Setup
    const masterKeyGetter = new MockMasterKeyManager();

    test('should create a profile', async () => {
        // ...
    });
});
```

### beforeAll / beforeEach 사용
```typescript
describe('Profile', () => {
    let storage: MemACStorage;
    let rtControl: RequestTemplateControl;
    const Nodes: RTMetadataNode[] = [];
    const Metadata: RTMetadata[] = [];

    beforeAll(() => {
        // 테스트 데이터 생성 (한 번만)
        for (let i = 0; i < 10; i++) {
            Nodes.push({ name: `node${i}`, id: `node${i}`, type: 'node' });
            Metadata.push({ name: `node${i}`, id: `node${i}`, mode: 'prompt_only' });
        }
    });

    beforeEach(() => {
        // 매 테스트 전 초기화
        storage = new MemACStorage();
        storage.register(PROFILE_STORAGE_TREE);
        rtControl = new RequestTemplateControl(storage.subStorage('request-template'));
    });

    test('getTree()', async () => { ... });
    test('addRT()', async () => { ... });
});
```

---

## Assertion 스타일

### 주요 matcher
```typescript
// 동등성 비교 (deep equal)
expect(actual).toEqual(expected);

// 원시값 비교
expect(decrypted).toBe(data);
expect(await rtControl.hasId(id)).toBe(true);

// 길이 확인
expect(encrypted.data.length).toBe(32);

// 에러 throw 확인
expect(() => aes.decrypt(encrypted.data, encrypted.iv)).toThrow(CryptError);
```

### `toEqual` vs `toBe`
- 객체/배열: `toEqual` (deep equality)
- 원시값/참조: `toBe` (strict equality)
- 이 규칙이 일관되게 적용됨

---

## 테스트 데이터 패턴

### 인라인 테스트 데이터
```typescript
test('should format date in UTC', () => {
    const date = new Date(Date.UTC(2024, 5, 1, 12, 30, 0));
    const formattedDate = formatDateUTC(date);
    expect(formattedDate).toEqual('240601-123000');
});
```

### 루프 기반 데이터 생성
```typescript
beforeAll(() => {
    for (let i = 0; i < 10; i++) {
        Nodes.push({
            name: `node${i}`,
            id: `node${i}`,
            type: `node`,
        });
    }
});
```

### 테스트 내부 헬퍼 함수
```typescript
test('hasId()', async () => {
    const expectTrue = async (...indexes: number[]) => {
        for (const i of indexes) {
            expect(await rtControl.hasId(Nodes[i].id)).toBe(true);
        }
    }
    const expectFalse = async (...indexes: number[]) => {
        for (const i of indexes) {
            expect(await rtControl.hasId(Nodes[i].id)).toBe(false);
        }
    }

    await expectFalse(0, 1, 2);
    await rtControl.addRT(Metadata[0]);
    await expectTrue(0);
    // ...
});
```

---

## 테스트 명명

### 함수/메서드 이름 기반
```typescript
test('getTree()', async () => { ... });
test('addRT()', async () => { ... });
test('removeRT()', async () => { ... });
test('updateTree()', async () => { ... });
test('hasId()', async () => { ... });
test('generateId()', async () => { ... });
test('changeId()', async () => { ... });
```

### 기능 설명 (should 스타일)
```typescript
test('should create a profile', async () => { ... });
test('should format date in UTC', () => { ... });
it('should fetch chat AI responses', async () => { ... });
```

### 한국어 설명 (상세 시나리오)
```typescript
test('updateTree() : 디렉토리 추가', async () => { ... });
test('updateTree() : 빈 디렉토리 추가 허용', async () => { ... });
test('removeTree() : RT 삭제 후 빈 디렉토리 허용', async () => { ... });
```
- 메서드명 + 콜론 + 한국어 시나리오 설명

---

## 테스트에서의 In-Memory 대체

```typescript
// 파일시스템 대신 메모리 스토리지
storage = new MemACStorage();

// MasterKey 대신 Mock
const masterKeyGetter = new MockMasterKeyManager();
masterKeyGetter.mockResetKey('123');

// 실제 Profile을 null 경로로 생성 (메모리 모드)
const profile = await Profile.From(null, { masterKeyGetter });
```
- 핵심 클래스가 null path를 받으면 메모리 모드로 동작하도록 설계됨
- Mock 클래스는 소스 코드에 포함되어 export
- 별도 mocking 라이브러리(`jest.mock` 등)보다 직접 구현한 Mock 클래스 선호

---

## 비동기 테스트

- `async/await` 패턴으로 비동기 테스트 작성
- 모든 테스트 함수에 `async` 명시
  ```typescript
  test('addRT()', async () => {
      await rtControl.addRT(Metadata[0]);
      const actual = await rtControl.getTree();
      expect(actual).toEqual(expected);
  });
  ```
- callback 기반 비동기 테스트는 사용하지 않음
