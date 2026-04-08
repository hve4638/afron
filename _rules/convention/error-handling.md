# Error Handling Patterns

## 커스텀 에러 클래스 구조

### 기본 패턴
모든 커스텀 에러는 `Error`를 직접 상속한다. 중간 Base Error 클래스는 사용하지 않는다.

```typescript
export class RTPackFailed extends Error {
    constructor(message: string) {
        super(message);
    }
}
```

### 에러 파일 위치
- 각 feature 디렉토리 내부에 `errors.ts` 또는 `errors/index.ts` 파일로 관리
  - `features/rt-worker/errors/index.ts`
  - `features/rt-packer/errors/index.ts`
  - `features/chatai-fetcher/errors.ts`
  - `lib/crypt-wrapper/errors.ts`
- 에러 클래스는 항상 `export`로 직접 내보냄 (named export)

### 에러 클래스 변형

#### 단순 에러 (메시지만)
```typescript
export class RTClosed extends Error {
    constructor() {
        super('RT session closed');
    }
}

export class IPCError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'IPCError';
    }
}
```

#### 추가 데이터를 포함하는 에러
```typescript
export class PromptMetadataParseError extends Error {
    extraInfomation: PromptMetadataParseErrorArgs;

    constructor(message: string, extraInfomation?: PromptMetadataParseErrorArgs) {
        super(message);
        this.name = 'PromptMetadataParseError';
        this.extraInfomation = extraInfomation ?? {
            errorType: PROMPT_METADATA_PARSE_ERRORS.OTHER,
        };
    }
}
```

#### 에러 계층 구조 (드물게 사용)
```typescript
export class PromptMetadataInternalError extends Error {
    rawdata: any;
    constructor(message: string, rawdata: any) {
        super(message);
        this.name = 'PromptMetadataInternalError';
        this.rawdata = rawdata;
    }
}

export class StructVerifyFailedError extends PromptMetadataInternalError {
    constructor(message: string, rawdata: any) {
        super(message, rawdata);
        this.name = 'VerifyFailedError';
    }
}
```

### `this.name` 설정
- 일부 에러에서는 `this.name`을 명시적으로 설정하고, 일부에서는 하지 않음
- 일관성은 없으나, `IPCError`, `PromptMetadataParseError` 등 주요 에러에서는 설정함

---

## IPC 에러 전파 패턴 (Error Result Tuple)

### Electron -> Front 에러 전달

IPC 통신에서는 **Result Tuple** 패턴을 사용한다: `[error, data?]`

#### Electron IPC Handler 측 (성공)
```typescript
async getTree(profileId: string) {
    const profile = await runtime.profiles.getProfile(profileId);
    const tree = await profile.getRTTree();
    return [null, tree] as const;  // [null, data] = 성공
}
```

#### Electron IPC Handler 측 (실패)
```typescript
async undoRemoved(profileId: string) {
    // 명시적 에러 반환
    return [new Error('No session to undo')] as const;
}
```

#### IPC 글로벌 에러 핸들러
`initIPC.ts`에서 모든 IPC 호출을 try-catch로 래핑:
```typescript
try {
    const result = await callback(...args);
    return result;
}
catch (error: any) {
    runtime.logger.error(`IPCError:`, ping, ...args);
    return [makeErrorStruct(error)];
}
```
- 잡히지 않은 예외는 자동으로 `[{ name, message }]` 구조로 변환

#### Front 측 에러 처리 (ElectronIPCAPI)
```typescript
async getTree(profileId: string): Promise<RTMetadataTree> {
    const [err, tree] = await electron.profileRTs.getTree(profileId);
    if (err) throw new IPCError(err.message);
    return tree;
}
```
- `[err, data]` 디스트럭처링
- `err`가 truthy이면 `IPCError`를 throw
- 모든 IPC 메서드가 이 패턴을 일관되게 따름

---

## 비동기 에러 처리

### try-catch-finally 패턴
```typescript
async run(input: NInput): Promise<NOutput> {
    try {
        this.logger.trace(`Enter ${this.name} (id=${this.nodeId})`);
        return this.process(input);
    }
    catch (error) {
        this.logger.error(`Error in '${this.name}' (id=${this.nodeId})`, error);
        throw error;  // 로깅 후 재throw
    }
    finally {
        // cleanup (있을 경우)
    }
}
```

### Promise chain 에러 처리
```typescript
process.process(rtInput)
    .then(() => {
        this.logger.info(`RT request completed (${token})`);
    })
    .catch((error) => {
        this.logger.info(`RT request failed (${token})`);
        this.logger.error(`RT request error:`, error);
    })
    .finally(() => {
        emitter.emit.directive.close();
        this.#sessions.delete(token);
    });
```

### throw new Error 직접 사용
유효성 검증 실패 시 커스텀 에러 또는 기본 Error throw:
```typescript
if (this.#sessions.has(token)) {
    this.logger.error(`RTWork failed: duplicate token`, token);
    throw new Error(`Duplicate token: ${token}`);
}
```

---

## 로깅과 에러의 관계

### LevelLogger 인터페이스
```typescript
export interface LevelLogger {
    error: LogMethod;
    warn: LogMethod;
    info: LogMethod;
    debug: LogMethod;
    trace: LogMethod;
}
```

### NoLogger (Null Object Pattern)
```typescript
class NoLogger implements LevelLogger {
    static instance: NoLogger = new NoLogger();
    private constructor() {}

    async trace(...messages: unknown[]) {}
    async debug(...messages: unknown[]) {}
    // ... 모든 메서드가 no-op
}
```
- 모든 로거를 사용하는 클래스에서 `logger ?? NoLogger.instance` 패턴으로 기본값 설정

### 에러 로깅 패턴
1. **에러 발생 전 로깅**: `this.logger.error(...)` -> `throw new Error(...)`
2. **catch에서 로깅 후 재throw**: 로깅 후 원본 에러를 다시 throw
3. **catch에서 로깅 후 흡수**: `.catch()` 내에서 로깅만 하고 에러 전파하지 않음

---

## 에러 코드 상수 패턴

에러 유형을 상수 객체 + 동일 이름 타입으로 정의:
```typescript
export const PROMPT_METADATA_PARSE_ERRORS = {
    INVALID_FORMAT: 'INVALID_FORMAT',
    NO_PROMPTS: 'NO_PROMPTS',
    NO_FIELD: 'NO_FIELD',
    // ...
} as const;
export type PROMPT_METADATA_PARSE_ERRORS = 
    typeof PROMPT_METADATA_PARSE_ERRORS[keyof typeof PROMPT_METADATA_PARSE_ERRORS];
```
- 값 객체와 타입을 동일한 이름으로 선언하여 값/타입 양쪽에서 모두 사용 가능
- `as const` assertion으로 리터럴 타입 보장

---

## Context 에러 (Front)

React Context가 Provider 없이 사용될 때:
```typescript
class NoContextProviderError extends Error {
    constructor(contextProviderName?: string) {
        let message: string;
        if (contextProviderName) {
            message = 'No context provider found: ' + contextProviderName;
        } else {
            message = 'No context provider found';
        }
        super(message);
        this.name = 'NoContextProviderError';
    }
}

export function useContextForce<T>(context: React.Context<T | null>): T {
    const contextValue = useContext(context);
    if (!contextValue) throw new NoContextProviderError();
    return contextValue;
}
```
