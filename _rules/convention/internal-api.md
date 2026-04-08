# Internal API Patterns

## Export 컨벤션

### Default Export 패턴 (주된 방식)
이 코드베이스에서는 **default export**가 클래스와 주요 모듈에서 지배적으로 사용된다.

```typescript
// 클래스 파일 끝에서
class RTWorker { ... }
export default RTWorker;

// 함수 파일 끝에서
function handler(): IPCInvokers.ProfileRTs { ... }
export default handler;
```

### Named Export 패턴
- 에러 클래스: 항상 named export
  ```typescript
  export class RTPackFailed extends Error { ... }
  export class RTUnpackFailed extends Error { ... }
  ```
- 타입/인터페이스: named export
  ```typescript
  export type ChatAIRequestAPI = typeof ChatAI.request;
  export interface FormBuilderProps { ... }
  ```
- 유틸리티 함수: named export
  ```typescript
  export function formatDateUTC(date?: Date): string { ... }
  export function isTextMIME(mimeType: string): boolean { ... }
  ```
- 상수: named export
  ```typescript
  export const PROFILE_STORAGE_TREE = { ... };
  export const HISTORY_VERSION = 1;
  ```

### Index Barrel 파일 패턴
feature 디렉토리의 `index.ts`에서 re-export:

```typescript
// 단순 re-export (default -> default)
import ProfileEvent from './ProfileEvent';
export default ProfileEvent;

// 이름 변경하여 re-export
import RTWorker from './RTWorker';
export default RTWorker;

// Named export 모음
export type { HistoryRequired } from './types';
export type { HistoryMessageRow } from './types';
```

### 패키지 entry point (core/src/index.ts)
```typescript
export { default as Logger, LogLevel } from '@/features/logger';
export { default as RTWorker } from '@/features/rt-worker';
export { RTPacker } from '@/features/rt-packer';
export type { LevelLogger } from '@/types';
export {
    default as Profiles,
    type Profile,
} from '@/features/profiles';
```
- `default as NamedExport` 패턴으로 default를 named로 변환
- `type` keyword를 사용하여 타입만 export하는 경우 명시

---

## Public vs Private API 구분

### 클래스 레벨 접근 제어

#### ES Private Fields (`#`)
가장 선호되는 private 패턴:
```typescript
class Profile {
    #basePath: string | null;
    #storage: ACStorage;
    #sessionControl: ProfileSessions;
    #dropped: boolean = false;

    async #readPersonalKey(): Promise<string> { ... }
}
```

#### `protected` 멤버
하위 클래스에서 접근해야 하는 경우:
```typescript
abstract class WorkNode<NInput, NOutput, NOption> {
    protected _nodeId: number;
    protected name: string = 'Node';
    protected logger: LevelLogger;

    protected abstract process(input: NInput): Promise<NOutput>;
}
```

#### `private constructor` + Static Factory
싱글톤 또는 팩토리 패턴에서:
```typescript
class Profile {
    static async From(path: string | null, required: ProfileRequried, logger?: LevelLogger) {
        const profile = new Profile(path, required, logger);
        await profile.initialize();
        return profile;
    }
    private constructor(profilePath: string | null, ...) { ... }
}

class NoLogger implements LevelLogger {
    static instance: NoLogger = new NoLogger();
    private constructor() {}
}

class ElectronIPCAPI implements IIPCAPI {
    static instance: ElectronIPCAPI | null = null;
    static getInstance() {
        ElectronIPCAPI.instance ??= new ElectronIPCAPI();
        return ElectronIPCAPI.instance;
    }
    private constructor() {}
}
```

---

## IPC API 구조

### Handler 패턴 (Electron 측)
각 handler는 클로저를 사용하는 함수:
```typescript
function handler(): IPCInvokers.ProfileRTs {
    const throttles = {};  // 핸들러 간 공유 상태

    return {
        async generateId(profileId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rtId = await profile.generateRTId();
            return [null, rtId] as const;
        },
        // ...
    }
}
export default handler;
```
- 반환값: `[null, data] as const` (성공) 또는 `[error] as const` (실패)
- 핸들러 함수가 반환하는 객체의 각 메서드가 하나의 IPC endpoint

### Handler 등록 (index.ts)
```typescript
function get(): IPCInvokerInterface {
    return {
        general: general(),
        globalStorage: globalStorage(),
        masterKey: masterKey(),
        profiles: profiles(),
        // ...
    };
}
```
- category.method 형식으로 자동 등록: `general_echo`, `profiles_create` 등

### Front API Layer
3단 구조:
1. **ElectronIPCAPI**: IPC 호출 + 에러 변환 (Result Tuple -> throw)
2. **ProfilesAPI / LocalAPI**: 비즈니스 로직 래핑
3. **ProfileEvent**: React 레이어에서 호출하는 최종 인터페이스

```typescript
// 3단계: ProfileEvent (정적 메서드 그룹)
class ProfileEvent {
    static readonly session = {
        create: () => SessionEvent.createSession(),
        remove: (id: string) => SessionEvent.removeSession(id),
    }
    static readonly rt = {
        create: (metadata, templateId = 'empty') => RTEvent.createRT(metadata, templateId),
    }
}
```

---

## 의존성 주입 패턴

### Optional Logger 주입
거의 모든 핵심 클래스에서 사용:
```typescript
class ChatAIFetcher {
    protected logger: LevelLogger;

    constructor(logger?: LevelLogger) {
        this.logger = logger ?? NoLogger.instance;
    }
}
```

### Interface를 통한 추상화
```typescript
interface IMasterKeyGettable {
    // masterKey getter
}

type ProfileRequried = {
    masterKeyGetter: IMasterKeyGettable;
}
```

### Runtime Registry (Electron)
```typescript
import runtime from '@/runtime';

// handler 내에서 runtime 접근
const profile = await runtime.profiles.getProfile(profileId);
```
- 전역 `runtime` 객체를 통한 의존성 접근

---

## Type-Value 동명 패턴 (Enum 대체)

TypeScript enum 대신 const object + type alias를 사용:
```typescript
export const MasterKeyInitResult = {
    INITIALIZED: 'initialized',
    ALREADY_INITIALIZED: 'already_initialized',
    FAILED: 'failed',
} as const;
type MasterKeyInitResult = typeof MasterKeyInitResult[keyof typeof MasterKeyInitResult];
```

```typescript
const LoadPhase = {
    Boot: 'boot',
    ProfileSelect: 'ProfileSelect',
    Login: 'login',
    Main: 'main',
};
type LoadPhase = typeof LoadPhase[keyof typeof LoadPhase];
```
- 값 공간과 타입 공간 모두에서 동일한 이름 사용
- `as const`로 리터럴 타입 보장
- `typeof X[keyof typeof X]`로 union 타입 추출
