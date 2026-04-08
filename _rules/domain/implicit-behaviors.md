# Implicit Behaviors

API 표면에서 직접 드러나지 않는 암묵적 동작, 부수효과, 캐싱 전략.

## 1. 지연 로딩 (Lazy Loading)

### 1.1 ProfileRTs 데이터 로딩

`ProfileRTs`의 트리 및 ID 목록은 최초 접근 시 한 번만 로딩된다.

```typescript
async #loadData() {
    if (this.#loaded) return;  // 이미 로드된 경우 skip
    // index.json에서 tree, ids 로드
    this.#loaded = true;
}
```

- 모든 public 메서드(`getTree`, `updateTree`, `addRT`, `removeRT` 등)는 내부에서 `#loadData()` 호출
- 주의: `removeRT()`와 `setRTPromptData()` 등 일부 메서드에서 `await` 없이 `this.#loadData()`를 호출하는 경우가 있음

### 1.2 Profile 인스턴스 캐싱

`Profiles`가 `ACStorage`를 통해 Profile을 접근하면, ACStorage 내부에서 accessor가 캐싱된다. 동일 Profile ID로 재접근 시 기존 인스턴스가 반환됨.

### 1.3 ProfileSessions 인스턴스 캐싱

```typescript
session(sessionId: string) {
    if (!(sessionId in this.sessionContainer)) {
        profileSession = new ProfileSession(this.#storage, sessionId);
        this.sessionContainer[sessionId] = profileSession;
    }
    return this.sessionContainer[sessionId];
}
```

동일 세션 ID 접근 시 캐싱된 `ProfileSession` 인스턴스 반환.

## 2. 부수효과 (Side Effects)

### 2.1 입력 필드 자동 초기화

RT 요청 시 설정에 따라 입력 필드가 자동으로 비워진다:

```typescript
// RTWorker.request() 내부
if ((input_type === 'normal' && clear_on_submit_normal)
    || (input_type === 'chat' && clear_on_submit_chat)) {
    session.set('cache.json', { input: '', upload_files: [] });
    emitter.emit.update.input();  // 프론트엔드에 입력 변경 통보
}
```

- `clear_on_submit_normal`: 일반 입력 모드에서 전송 후 초기화 (기본값: false)
- `clear_on_submit_chat`: 채팅 모드에서 전송 후 초기화 (기본값: true)

### 2.2 히스토리 자동 기록

`WorkflowPromptOnly` 처리 중 히스토리가 자동으로 기록된다:

1. `historyAC.addHistory(...)` -- 히스토리 엔트리 생성 (폼, 시각, RT ID, 모델 ID)
2. `historyAC.addHistoryMessage(historyId, data.input)` -- 입력 메시지 기록
3. 응답 수신 후 `historyAC.addHistoryMessage(historyId, data.output)` -- 출력 메시지 기록
4. `historyAC.completeHistory(historyId)` -- finally 블록에서 항상 호출 (에러 시에도)

### 2.3 ACStorage 접근 이벤트

Profile의 ACStorage는 모든 접근을 로깅한다:

```typescript
this.#storage.addListener('access', (identifier) => {
    this.logger.trace(`Profile storage accessed: ${identifier}`);
});
```

### 2.4 개인 키 자동 생성

Profile 초기화 시 `personal-key`가 없으면 UUIDv4로 자동 생성하여 암호화 저장:

```typescript
async #readPersonalKey(): Promise<string> {
    let key = await uniqueAC.getOne('personal-key');
    if (key == undefined) {
        key = uuidv4().trim();
        uniqueAC.setOne('personal-key', key);
    }
    return key;
}
```

### 2.5 RT 메타데이터 누락 필드 자동 수정

`ProfileRT.fixMetadata()`는 버전 업데이트로 누락된 필드를 자동 추가:

```typescript
async fixMetadata() {
    const uuid = indexAC.getOne('uuid');
    if (!uuid) {
        indexAC.setOne('uuid', uuidv7());
    }
}
```

## 3. 비동기 실행 패턴 (Fire-and-Forget)

### 3.1 RTWorker의 비동기 처리

RTWorker.request()는 워크플로우를 비동기로 시작하고 즉시 토큰을 반환:

```typescript
process.process(rtInput)
    .then(() => { /* 완료 로그 */ })
    .catch((error) => { /* 에러 로그 */ })
    .finally(() => {
        emitter.emit.directive.close();  // 항상 close 이벤트 발행
        this.#sessions.delete(token);     // 세션 정리
    });
return token;  // 즉시 반환
```

- 프론트엔드는 토큰을 받은 후 Channel을 통해 이벤트 스트림 수신
- **불변 조건**: finally 블록에서 항상 `close` 이벤트 발행 및 세션 정리

### 3.2 ResponseReceiver의 이벤트 루프

프론트엔드에서 `responseReceiver()`는 while 루프로 이벤트를 소비:

```typescript
while (true) {
    const data = await RequestEventPipe.receive(chId);  // blocking consume
    if (data === null || data.type === 'close') break;
    // 이벤트 처리...
}
```

- `Channel.consume()`은 데이터가 생산될 때까지 await
- `close` 이벤트 또는 null 수신 시 루프 종료

## 4. 에러 처리 전략

### 4.1 IPC 에러 래핑

모든 IPC 핸들러 에러는 `makeErrorStruct()`로 래핑되어 프론트엔드에 전달:

```typescript
function makeErrorStruct(error: any) {
    return { name: error.name, message: error.message };
}
```

프론트엔드에서는 결과 튜플의 첫 번째 요소 존재 여부로 에러 판단.

### 4.2 WorkNode 에러 전파

노드 파이프라인의 에러 전파 전략:
1. 비즈니스 에러 -> `RTEventEmitter`로 프론트엔드에 통보 -> `WorkNodeStop` throw
2. `ChatAIError` (API 라이브러리 에러) -> fetch_failed 이벤트 -> `WorkNodeStop`
3. HTTP 에러 -> http_error 이벤트 (상태코드 포함) -> `WorkNodeStop`
4. 예기치 않은 에러 -> other 이벤트 -> `WorkNodeStop`

### 4.3 RTEventEmitter의 disabled 상태

`RTEventEmitter`가 disabled 상태에서 이벤트 발행 시 `RTClosed` 예외가 throw된다. 다만 `#sendForce()`를 사용하는 에러/close 이벤트는 disabled 상태에서도 전달됨:

- `#send()`: disabled 체크 (error, other, close 이외)
- `#sendForce()`: disabled 무시 (invalidModel, envError, other, close 등 중요 이벤트)

## 5. 암묵적 디렉토리 생성

Profile 생성 시 basePath 디렉토리가 자동 생성:

```typescript
if (this.#basePath) {
    fs.mkdirSync(this.#basePath, { recursive: true });
}
```

## 6. 프로필 ID 충돌 회피

새 프로필 생성 시 `profile_N` 형식으로 ID를 생성하되, 기존 ID 및 파일시스템의 디렉토리와 충돌하지 않을 때까지 N을 증가:

```typescript
while (true) {
    const identifier = `profile_${this.#nextProfileId}`;
    if (this.#existsProfileId(identifier)) { this.#nextProfileId += 1; continue; }
    if (fs.existsSync(profilePath) && isDirectory) { this.#nextProfileId += 1; continue; }
    return identifier;
}
```

## 7. 인메모리 모드

`basePath`가 null인 경우 `MemACStorage`를 사용하여 파일시스템 없이 동작:

- Profile, Profiles 모두 지원
- 테스트 및 개발 환경(`ELECTRON_IN_MEMORY=TRUE`)에서 사용
- `AfronEnv.inMemory` 플래그로 제어

## 8. 세션 상태 머신

프론트엔드에서 세션의 상태(`state`)는 암묵적 상태 머신을 따른다:

```
idle -> loading -> done -> idle
         |
         +-> error (에러 시에도 done으로 전환 후 idle)
```

- `responseReceiver` 시작: `changeState('loading')`
- close 이벤트 수신: `changeState('done')`
- 프론트엔드에서 done 상태 감지 후 idle로 전환

## 9. 런타임 레지스트리 (Global Mutable State)

`packages/electron/src/runtime/registry.ts`의 `registry` 객체는 전역 가변 상태:

```typescript
export const registry: RuntimeRegistry = {
    profiles: null as any,
    globalStorage: null as any,
    masterKeyManager: null as any,
    rtWorker: null as any,
    // ...
};
```

- 초기화 순서에 의존: `initRegistryPriority` -> `initRegistry` -> `initRegistryWithEnv` -> `initIPC`
- `updateRegistry()`로 점진적 초기화
- IPC 핸들러는 `runtime` import로 레지스트리에 접근
- **주의**: 초기화 전 접근 시 null 참조 에러 가능 (타입상 `null as any`로 우회)
