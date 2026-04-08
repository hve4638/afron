# Design Invariants

시스템이 의존하는 불변 조건과 설계 규칙.

## 1. IPC 결과 규약 (Result Convention)

모든 IPC 호출은 반드시 `EResult<T>` 또는 `ENoResult` 형식으로 응답한다.

```typescript
type EResult<T> = Promise<readonly [EError] | readonly [null, T]>;
type ENoResult = Promise<readonly [EError | null]>;
```

- 성공: `[null, data]` (EResult) 또는 `[null]` (ENoResult)
- 실패: `[{ name, message }]`
- **불변 조건**: 예외를 throw하지 않고 항상 튜플로 반환. `initIPC()`의 `handleIPC()`가 모든 예외를 catch하여 에러 구조체로 변환.

## 2. 토큰 기반 요청 추적

RT 요청은 프론트엔드에서 생성한 UUIDv7 토큰으로 추적된다.

- **불변 조건**: 토큰은 고유해야 한다. RTWorker는 중복 토큰 수신 시 예외를 throw한다.
- **생명주기**: 토큰 생성(Frontend) -> 세션 등록(RTWorker) -> 처리 완료/중단 시 세션 삭제
- **양방향 매핑**: Frontend의 `Channel<RTEventData>`와 Backend의 `RTWorkSession`이 동일 토큰으로 연결

## 3. ACStorage 선언적 스키마

저장소 구조는 `StorageAccess.JSON()`, `StorageAccess.Custom()`, `StorageAccess.Binary()` 등으로 선언적 정의.

- **불변 조건**: 저장소 트리에 선언되지 않은 경로는 접근 불가
- **와일드카드**: `'*'` 키로 동적 경로 허용 (세션 ID, RT ID 등)
- **커스텀 accessor**: `addAccessEvent(type, { init, save, destroy, ... })`로 라이프사이클 훅 등록
  - `history`: SQLite 기반 (`HistoryAccessor`)
  - `secret-json`: AES 암호화 JSON (`SecretJSONAccessor`)

## 4. RT 트리 무결성

RT 트리 갱신 시 기존 RT는 모두 유지되어야 한다.

- **불변 조건**: `updateTree(newTree)` 호출 시, 새 트리의 모든 RT ID가 기존 트리에 존재해야 한다. 존재하지 않는 ID가 포함되면 예외.
- RT 추가는 반드시 `addRT()` -> `updateTree()` 순서
- 디렉토리는 `updateTree()`로 직접 추가/제거 가능 (빈 디렉토리 허용)

## 5. 마스터 키 의존성

민감 데이터(API 키) 접근 전 마스터 키가 반드시 초기화되어야 한다.

- **불변 조건**: `Profile` 생성 시 `IMasterKeyGettable`이 주입되며, `masterKey`가 null이면 `ProfileError` throw
- **초기화 순서**: MasterKeyManager.init() -> Profiles.From() -> Profile.From()
- 하드웨어 키(시스템 정보 기반) 또는 복구 키로 마스터 키 복호화

## 6. 세션 소프트 삭제

세션 삭제 시 즉시 파일시스템에서 제거하지 않는다.

- **불변 조건**: 삭제된 세션은 `removed_sessions` 배열로 이동
- 최대 보관 수(`removed_session_limit`, 기본 30) 초과 시 가장 오래된 것부터 영구 삭제
- `undoRemove()`로 마지막 삭제 복구 가능

## 7. 모델 ID 네이밍 규약

- 내장 모델: `metadataId`로 식별 (예: `gpt-4o`, `claude-3-5-sonnet`)
- 커스텀 모델: `custom:` prefix 필수 (예: `custom:my-model-id`)
- **불변 조건**: `ChatAIFetchNode`에서 `modelId.startsWith('custom:')` 분기로 처리 경로가 결정됨

## 8. APTL 프롬프트 템플릿 규약

프롬프트 템플릿은 APTL(Advanced Prompt Template Language) 문법을 따른다.

- 내장 변수: `{{:input}}` (사용자 입력), `{{:chat}}` (대화 이력)
- 사용자 변수: `{{varName}}` 형식
- 역할 지시자: `{{::role system}}`, `{{::role user}}`, `{{::role assistant}}`
- 조건문: `{{::if var}}` ... `{{::endif}}`
- 반복문: `{{::foreach ele in array}}` ... `{{::endforeach}}`
- **불변 조건**: 컴파일 실패 시 `WorkNodeStop` 예외로 전체 파이프라인 중단. 실행 에러도 동일.

## 9. 싱글 인스턴스 제약

Electron 앱은 단일 인스턴스만 실행 가능.

```typescript
const gotLocked = app.requestSingleInstanceLock();
if (gotLocked === false) process.exit(0);
```

## 10. 노드 파이프라인 에러 규약

`WorkNode` 파이프라인에서 에러 시 `WorkNodeStop` 예외를 throw한다.

- **불변 조건**: `WorkNodeStop`은 정상적 파이프라인 중단을 의미한다 (사용자 에러, 빈 입력, API 실패 등)
- 각 노드는 에러 발생 시 `RTEventEmitter`를 통해 에러 유형을 프론트엔드에 전달한 후 `WorkNodeStop` throw
- 호출자(`WorkflowPromptOnly`)는 `WorkNodeStop`을 catch하여 히스토리를 적절히 마무리

## 11. 이벤트 채널 분리

IPC 리스너는 용도별로 분리된 채널 사용:

- `IPCListenerPing.Request`: RT 요청/응답 이벤트
- `IPCListenerPing.Global`: 전역 이벤트 (RT 내보내기/가져오기 등)
- `IPCListenerPing.Debug`: 디버그 이벤트

## 12. 프론트엔드 스토어 동기화 규약

Zustand 스토어의 상태는 항상 백엔드의 진실 소스(source of truth)와 동기화되어야 한다.

- `update` 메서드: 로컬 상태 즉시 갱신 + IPC로 백엔드 저장
- `refetch` 메서드: IPC로 백엔드에서 최신값 조회 + 로컬 상태 갱신
- `refetchAll`: 모든 필드를 백엔드에서 재조회
- **불변 조건**: 백엔드가 유일한 진실 소스(source of truth). 프론트엔드는 캐시.
