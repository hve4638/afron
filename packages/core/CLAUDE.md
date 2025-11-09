# @afron/core - Code Conventions & Architecture

## 📦 패키지 개요

**목적**: Afron 애플리케이션의 핵심 비즈니스 로직 및 도메인 모델

**역할**:
- 프로필 및 세션 관리
- Request Template (RT) 처리 및 실행
- AI 모델 API 통합 및 Form 생성
- 스토리지 및 데이터베이스 접근
- 암호화 및 마스터 키 관리
- 이벤트 시스템
- 로깅 인프라

**기술 스택**:
- TypeScript (Strict mode)
- Vitest (테스팅)
- Rollup (빌드)
- ACStorage (스토리지 추상화)
- Better-SQLite3 (데이터베이스)

**의존성**:
- `@afron/types` (타입 정의)
- `@hve/chatai` (ChatAI SDK)
- `ac-storage` (스토리지 라이브러리)

---

## 📁 디렉토리 구조

```
packages/core/
├── src/
│   ├── features/        # Feature-based 모듈 (14개)
│   │   ├── acstorage-accessor/       # DB/스토리지 접근
│   │   ├── app-version-manager/      # 앱 버전 추적
│   │   ├── chatai-fetcher/           # AI API 통합
│   │   ├── event-emitter/            # 이벤트 시스템
│   │   ├── logger/                   # 로깅 인프라
│   │   ├── nologger/                 # Null object 로거
│   │   ├── masterkey-manager/        # 암호화 키 관리
│   │   ├── model-metadata-resolver/  # AI 모델 메타데이터
│   │   ├── profile-control/          # 프로필 API 키 관리
│   │   ├── profiles/                 # 프로필 및 세션
│   │   ├── rt-packer/                # RT 패킹/언패킹
│   │   ├── rt-template-factory/      # RT 팩토리
│   │   └── rt-worker/                # RT 실행 워크플로우
│   ├── lib/             # 서드파티 래퍼
│   │   ├── crypt-wrapper/            # AES 암호화
│   │   ├── zipper/                   # Zip 생성
│   │   ├── unzipper/                 # Zip 추출
│   │   ├── istext/                   # 텍스트 감지
│   │   └── uuid/                     # UUID 생성
│   ├── utils/           # 유틸리티 함수
│   ├── types/           # 공유 타입 정의
│   ├── data/            # 데이터 스키마
│   └── index.ts         # 메인 진입점
├── package.json
├── tsconfig.json
├── rollup.config.js
└── jest.config.ts
```

**조직화 원칙**:
- Feature-based modular architecture
- Domain-driven design
- 명확한 관심사 분리
- Interface-based abstractions

---

## 📝 코드 컨벤션

### 1. 파일 네이밍

| 파일 타입 | 규칙 | 예시 |
|----------|------|------|
| 클래스 파일 | `PascalCase.ts` | `HistoryAccessor.ts`, `ZipBuilder.ts` |
| 유틸리티/데이터 | `kebab-case.ts` | `storage-tree.ts`, `array-utils.ts` |
| 에러 정의 | `errors.ts` | 각 feature의 `errors.ts` |
| Index 파일 | `index.ts` | Barrel exports |

**규칙**:
- 주 클래스 파일은 클래스명과 정확히 일치 (PascalCase)
- 유틸리티, 헬퍼, 데이터 파일은 kebab-case
- 테스트 파일: `*.test.ts` (소스와 동일 위치)

### 2. 클래스 & 함수 네이밍

#### 클래스: `PascalCase`

```typescript
class Profile
class MasterKeyManager
class HistoryAccessor
class ZipBuilder
```

**에러 클래스**: `*Error` 접미사

```typescript
class ProfileError extends Error
class ZipBuilderError extends Error
```

#### 함수/메서드: `camelCase`

```typescript
addHistory()
getProfile()
createUsingTemplate()
```

**Async 메서드**: 특별한 접두사/접미사 없음

#### Private 필드/메서드: `#` 접두사 (ES2022)

```typescript
#masterKey
#basePath
#storage
#setupRawEncryptionData()
```

#### 변수 & 상수

```typescript
// Private fields
#masterKey: string | null
#basePath: string

// Constants
const PROFILES_METADATA_PATH = 'profiles.json';
const EMITTER_DEFAULT_EVENT = Symbol('default');

// Protected fields
protected target: string

// Regular variables
const categoryBuilder = new CategoryBuilder();
```

### 3. 타입 네이밍

**인터페이스**: `PascalCase`, 종종 `I` 접두사

```typescript
interface IMasterKeyGettable
interface ICustomAccessor
interface IProfileRT
```

**Type Aliases**: `PascalCase`

```typescript
type HistoryRow = { ... }
type LevelLogger = { ... }
type ProfileRequired = { ... }
```

**Type Parameters**: 단일 대문자 또는 `T` 접두사

```typescript
<TEventData>
<T>
```

---

## 🏗️ 아키텍처 패턴

### 전체 아키텍처

**Feature-Based Modular Architecture**:
- 도메인 주도 설계 (DDD) 원칙
- 생성자를 통한 의존성 주입
- 인터페이스 기반 추상화

### 모듈 구조 패턴

각 feature 모듈:

```
feature-name/
├── FeatureName.ts       # 메인 구현
├── index.ts             # Barrel exports
├── errors.ts            # 커스텀 에러
├── types.ts or types/   # 타입 정의
├── SubFeature/          # 서브 모듈
│   ├── index.ts
│   └── ...
└── FeatureName.test.ts  # 테스트 (동일 위치)
```

### 계층 구조

1. **Features Layer** - 비즈니스 로직 및 도메인 모델
2. **Library Layer** - 서드파티 래퍼 추상화
3. **Utilities Layer** - 순수 함수 및 헬퍼
4. **Types Layer** - 공유 타입 정의

### 의존성 흐름

- Features → lib, utils, types
- Lib → utils, types
- Utils, types → 내부 의존성 없음
- Path aliasing: `@/*` → `src/*`

---

## 🎨 디자인 패턴

### 1. Factory Pattern

**Static Factory Methods** (`From` 관례):

```typescript
class Profiles {
    static async From(basePath: string | null, required: ProfilesRequired) {
        const instance = new Profiles(basePath, required);
        await instance.loadMetadata();
        return instance;
    }
    private constructor(...) { }
}
```

**특징**:
- 비동기 초기화 가능
- Private constructor로 팩토리 강제
- `Profile`, `Profiles`, `MasterKeyManager`에서 사용

**Factory Classes**:

```typescript
class RTPacker {
    private constructor() { }
    static Packer(profile: Profile, logger?: LevelLogger) {
        return new RTPackerV1(profile, logger);
    }
    static Unpacker(profile: Profile, logger?: LevelLogger) {
        return new RTUnpackerV1(profile, logger);
    }
}
```

### 2. Singleton Pattern

```typescript
class NoLogger implements LevelLogger {
    static instance: NoLogger = new NoLogger();
    private constructor() {}
}
```

**사용처**: NoLogger (Null Object Pattern)

### 3. Builder Pattern

```typescript
class ZipBuilder {
    addText(content: string, filePath: string): this { }
    addJson(obj: any, filePath: string): this { }
    addFile(filePath: string, zipPath: string): this { }
    async build(): Promise<void> { }
}
```

**특징**:
- Fluent interface (메서드 체이닝)
- Build 유효성 검사 (중복 빌드 시 throw)

### 4. Facade Pattern

```typescript
class FormBuilder {
    base() { return new BaseFormBuilder(this.props).build(); }
    generativeLanguage() { return new GeminiFormBuilder(this.props).build(); }
    chatCompletion() { return new ChatCompletionFormBuilder(this.props).build(); }
}
```

**목적**: 복잡한 서브시스템 접근 단순화

### 5. DAO (Data Access Object) Pattern

```typescript
class HistoryAccessor implements ICustomAccessor {
    #dao: HistoryDAO;

    addHistory(required: HistoryAddRequired): HistoryId { }
    getHistory(offset, limit, desc): HistoryRow[] { }
}
```

**분리**:
- **Accessor**: 비즈니스 로직
- **DAO**: 데이터 작업

### 6. Dependency Injection

```typescript
constructor(protected target: string, logger?: LevelLogger) {
    this.#logger = logger ?? NoLogger.instance;
}
```

**특징**:
- 생성자 주입
- Optional logger with Null Object 기본값

### 7. Template Method Pattern

- 상속 기반 템플릿 (예: form builders)
- 재정의 가능한 메서드를 가진 베이스 클래스

---

## ⚠️ 에러 처리 패턴

### Custom Error Classes

각 모듈은 도메인별 에러 정의:

```typescript
export class ProfileError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ProfileError';
    }
}
```

**일관된 패턴**:
- `Error` 상속
- `name` 속성 설정
- 단일 생성자 (message)
- `errors.ts` 파일에 동일 위치

### Error 위치

**7개의 에러 정의 파일**:
- `/features/chatai-fetcher/errors.ts`
- `/features/event-emitter/errors.ts`
- `/features/profiles/Profile/errors.ts`
- `/features/rt-worker/nodes/errors.ts`
- `/lib/crypt-wrapper/errors.ts`
- `/lib/zipper/errors.ts`
- `/lib/unzipper/errors.ts`

### 에러 처리 전략

```typescript
try {
    const decrypted = await this.encryptModel.decrypt(encrypted, key);
    this.#masterKey = decrypted;
    return;
} catch (e) {
    this.logger.trace('failed to decrypt with recovery key');
    continue;
}
```

**전략**:
- Try-catch 블록과 로깅
- 적절한 곳에서 Graceful degradation
- 복구 불가능한 실패는 throw

---

## 🧪 테스트 패턴

### 프레임워크

- **Vitest** (Jest 대체)
- 테스트 파일: `*.test.ts` (소스와 동일 위치)

### 테스트 구조

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('FeatureName', () => {
    let instance: FeatureName;

    beforeEach(() => {
        // Setup
        instance = new FeatureName(null); // In-memory
    });

    afterEach(() => {
        // Cleanup
        instance.drop();
    });

    it('should do something', () => {
        // Arrange, Act, Assert
        expect(result).toBe(expected);
    });
});
```

### 테스트 관례

1. **In-memory databases**: `new HistoryAccessor(null)` (격리된 테스트)
2. **Helper utilities**: `test/utils.ts`의 테스트 유틸리티
3. **Descriptive test names**: `'should insert and select history'`
4. **Setup/teardown**: 테스트 격리를 위한 `beforeEach`/`afterEach`

### 테스트 커버리지

- **8개의 테스트 파일**
- Critical paths 테스트: 암호화, 데이터베이스 작업, 핵심 기능
- Unit test 중심

---

## 🔑 주요 아키텍처 결정사항

### 1. Private Fields with # Syntax

모던 JavaScript private fields 사용:

```typescript
#basePath: string | null;
#storage: ACStorage;
#masterKey: string | null;
```

**장점**:
- 진정한 캡슐화
- TypeScript & 런타임 프라이버시

### 2. Async/Await Everywhere

- 일관된 async 패턴
- Factory 메서드는 async
- 모든 I/O 작업은 async

### 3. Null Object Pattern for Logger

```typescript
this.logger = logger ?? NoLogger.instance;
```

**장점**:
- Null 체크 불필요
- Optional 로깅 주입
- NoLogger는 LevelLogger 인터페이스 구현

### 4. Storage Abstraction Layer

- `ACStorage` 라이브러리로 파일/DB 접근
- Custom accessors는 `ICustomAccessor` 구현
- Registration-based storage tree
- Event-driven lifecycle hooks

### 5. Type Safety

```json
{
  "strict": true,
  "noImplicitAny": false,
  "noPropertyAccessFromIndexSignature": true,
  "noImplicitOverride": true
}
```

**특징**:
- Strict TypeScript 설정
- 일부 실용적 완화 (`noImplicitAny: false`)

### 6. Dual Package Support (ESM + CJS)

- Rollup이 두 포맷 모두 번들링
- Modern module system ready

### 7. Path Aliasing

```json
"paths": { "@/*": ["src/*"] }
```

**사용**:
```typescript
import { Profile } from '@/features/profiles'
```

### 8. Encryption Architecture

- 하드웨어 바인딩과 함께 마스터 키 시스템
- 버전별 암호화 모델 (Gen0, Gen1)
- Recovery key 지원
- 민감 데이터의 암호화 저장소

### 9. Feature Isolation

- 각 feature는 자체 포함
- Feature 간 순환 의존성 없음
- 인터페이스를 통한 통신

### 10. 한글 주석

- 문서화는 한글
- 사용자용 문자열은 한글
- 코드/변수명은 영어

---

## 🔧 Export 패턴

### Barrel Exports (index.ts)

모든 모듈은 barrel exports 사용:

```typescript
// Simple re-export
export { default as GlobalEventEmitter } from './GlobalEventEmitter';

// Default + Named exports
import Profiles from './Profiles';
export type { default as Profile } from './Profile';
export default Profiles;

// Multiple named exports
export { ZipBuilder } from './ZipBuilder';
export { ZipBuilderError } from './errors';
```

### Main Package Export (`/src/index.ts`)

- 공개 API만 export
- 클래스는 default export
- 타입과 유틸리티는 named export
- 명확한 문서화 주석 (한글)

### Package.json Exports

```json
{
  "main": "./dist/bundle.cjs",
  "module": "./dist/bundle.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/bundle.mjs",
      "require": "./dist/bundle.cjs"
    }
  }
}
```

---

## 💡 개발자 가이드

### 네이밍 체크리스트

- [ ] 클래스: `PascalCase`
- [ ] 함수/메서드: `camelCase`
- [ ] Private 필드: `#camelCase`
- [ ] 상수: `SCREAMING_SNAKE_CASE`
- [ ] 파일: 클래스는 `PascalCase.ts`, 유틸리티는 `kebab-case.ts`
- [ ] 에러 클래스: `*Error` 접미사
- [ ] 인터페이스: `I*` 접두사 (optional)

### 조직화 체크리스트

- [ ] Feature별 디렉토리 구성
- [ ] `index.ts`로 barrel export
- [ ] 에러는 `errors.ts`에 정의
- [ ] 타입은 `types.ts` 또는 `types/`에 정의
- [ ] 테스트는 소스와 동일 위치 (`*.test.ts`)

### 패턴 체크리스트

- [ ] 비동기 초기화는 static factory method 사용
- [ ] Private constructor로 factory 강제
- [ ] Logger는 optional injection with Null Object
- [ ] Custom error 클래스 정의
- [ ] Fluent interface로 builder 구현
- [ ] Interface로 추상화

### Best Practices

1. ✅ Private fields (`#field`) 사용
2. ✅ Factory method는 `async`로
3. ✅ Logger는 `logger ?? NoLogger.instance`
4. ✅ Path alias (`@/`) 사용
5. ✅ 에러에 명확한 메시지
6. ✅ In-memory mode로 테스트 가능하게
7. ✅ Barrel exports로 깔끔한 API

---

## 📚 주요 Feature 모듈

### 1. profiles

- 프로필 및 세션 관리
- RT (Request Template) 관리
- 히스토리 추적
- 암호화 스토리지

### 2. chatai-fetcher

- AI 모델 API 통합
- Form 생성 (다양한 프로바이더)
- Request/Response 처리

### 3. rt-worker

- RT 실행 워크플로우
- Node 기반 실행 그래프
- 프롬프트 생성
- 변수 치환

### 4. masterkey-manager

- 마스터 키 관리
- 하드웨어 바인딩
- Recovery key
- 암호화 모델 버전 관리

### 5. acstorage-accessor

- 데이터베이스 접근
- 커스텀 accessor 구현
- SQL 쿼리 래핑

---

## 📊 통계

- **총 TypeScript 파일**: ~125개
- **Feature 모듈**: 14개
- **테스트 파일**: 8개
- **에러 정의 파일**: 7개
- **라이브러리 래퍼**: 5개

---

## ✨ 핵심 특징

이 코드베이스는 다음을 보여줍니다:

✅ **명확한 feature-based 조직화** - 탐색 및 확장 용이
✅ **일관된 네이밍 규칙** - PascalCase 클래스, camelCase 메서드, # private
✅ **강력한 디자인 패턴** - Factory, Builder, Singleton, DAO, Facade
✅ **견고한 에러 처리** - 도메인별 커스텀 에러 클래스
✅ **포괄적인 타입 안전성** - Strict TypeScript, 인터페이스 기반 설계
✅ **모던 JavaScript** - Private fields, async/await, ESM/CJS 듀얼 지원
✅ **테스트 가능한 아키텍처** - In-memory 모드, 의존성 주입
✅ **Barrel exports** - 깔끔한 공개 API
✅ **보안 우선** - 암호화, 마스터 키 관리, 하드웨어 바인딩

---

**마지막 업데이트**: 2025-11-09
