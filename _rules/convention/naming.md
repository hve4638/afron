# Naming Conventions

## 파일 이름

### 클래스/컴포넌트 파일
- **PascalCase** 사용: `RTWorker.ts`, `ChatAIFetcher.ts`, `ProfileEvent.ts`, `WorkNode.ts`
- 클래스명과 파일명이 1:1 대응
- Abstract 클래스도 동일: `WorkNode.ts` (abstract class WorkNode)

### React 컴포넌트 파일
- **PascalCase**: `App.tsx`, `Bootstrap.tsx`, `Workflow.tsx`, `SidePanel.tsx`
- 관련 hook 파일은 `{ComponentName}.hook.tsx` 또는 `{ComponentName}.hooks.ts` 패턴 사용
  - 예: `RTEditModal.hook.tsx`, `FormModal.hooks.ts`, `Workflow.hooks.ts`
- SCSS 모듈은 `{ComponentName}.module.scss`

### 유틸리티/함수 파일
- **camelCase**: `date.ts`, `utils.ts`, `data.ts`, `errors.ts`
- 타입 전용 파일: `types.ts` 또는 `type.ts`

### 테스트 파일
- `{SourceFileName}.test.ts` 형식 (소스 파일 옆에 위치)
  - `Profile.test.ts`, `RTControl.test.ts`, `AES.test.ts`
- `.spec.ts`는 사용하지 않음

### index 파일 (Barrel Export)
- 모든 feature 디렉토리에 `index.ts` 존재
- 주로 re-export 목적: `export default ClassName;` 또는 `export { ... } from './...';`

---

## 변수/프로퍼티 이름

### 일반 변수
- **snake_case** 사용이 일반적 (특히 데이터 필드/설정):
  ```typescript
  rt_id, model_id, upload_files, input_type
  clear_on_submit_normal, clear_on_submit_chat
  font_size, theme_mode, layout_mode
  max_history_limit_per_session
  ```

### 함수 인자/로컬 변수
- **camelCase**: `profileId`, `sessionId`, `rtId`, `modelConfiguration`
- 함수의 매개변수, 로컬 변수는 camelCase
- 저장소/설정 키는 snake_case (데이터 스키마 레벨)

### 클래스 멤버
- Private 필드: `#` prefix (ES private fields) 사용
  ```typescript
  #sessions: Map<string, RTWorkSession> = new Map();
  #handlers: RTEventListener[];
  #basePath: string | null;
  ```
- Protected 필드: `protected` keyword, camelCase
  ```typescript
  protected logger: LevelLogger;
  protected _nodeId: number;  // underscore prefix도 간혹 사용
  ```

---

## 함수/메서드 이름

### 클래스 메서드
- **camelCase**: `addRT()`, `removeRT()`, `hasRTId()`, `generateRTId()`
- CRUD 동사 패턴:
  - 생성: `create`, `add`
  - 읽기: `get`, `access`, `has`
  - 수정: `update`, `set`, `change`
  - 삭제: `remove`, `delete`, `drop`
- Private 메서드: `#` prefix
  ```typescript
  #requestKnownProviderModel()
  #getAPICategory()
  #readPersonalKey()
  ```

### React Hooks
- `use` prefix + PascalCase 동사/명사: `useEvent`, `useCache`, `useConfigStore`
- Custom hook 파일명: `use{Name}.ts`
- Store hooks: `use{StoreName}Store` (예: `useMemoryStore`, `useConfigStore`)
- Context hooks: `useContextForce`, `useRTStore`

### Static Factory Methods
- `From` 메서드 (PascalCase): `Profile.From(path, required, logger)`
- `getInstance` 패턴: `ElectronIPCAPI.getInstance()`

---

## 클래스 이름

### 일반 클래스
- **PascalCase**: `RTWorker`, `ChatAIFetcher`, `Profile`, `ProfileSessions`
- 약어도 PascalCase의 일부로: `RT` (Request Template), `IPC`, `AI`

### 에러 클래스
- `{동작}{결과}` 패턴: `RTPackFailed`, `ChatAIFetcherFailed`, `RTClosed`
- 또는 `{도메인}Error` 패턴: `ProfileError`, `IPCError`, `CryptError`, `VarMetadataError`
- 상세 내용 포함: `PromptMetadataParseError`, `PromptTemplateLoadError`

### Interface/Type
- Interface: `I` prefix를 사용하는 경우와 사용하지 않는 경우 혼재
  - `IMasterKeyGettable`, `IIPCAPI` (I prefix)
  - `LevelLogger`, `RequestProps` (prefix 없음)
- Type: suffix 없이 PascalCase
  ```typescript
  type WorkRequired = { ... }
  type WorkOptions = { ... }
  type RTInput = { ... }
  ```

---

## 모듈/패키지 이름

### 패키지
- `@afron/types`, `@afron/core`, `@afron/chatai-models` (kebab-case, 스코프 prefix)

### Feature 디렉토리
- **kebab-case**: `rt-worker`, `rt-packer`, `chatai-fetcher`, `masterkey-manager`, `profile-event`
- 하위 구조: `features/{feature-name}/` 패턴

---

## 상수 이름

### Enum-like 객체
- **PascalCase** 이름 + UPPER_CASE 값:
  ```typescript
  const LoadPhase = {
      Boot: 'boot',
      ProfileSelect: 'ProfileSelect',
      Login: 'login',
      Main: 'main',
  };
  ```
  ```typescript
  export const MasterKeyInitResult = {
      INITIALIZED: 'initialized',
      ALREADY_INITIALIZED: 'already_initialized',
      FAILED: 'failed',
  } as const;
  ```
- 에러 코드 상수는 UPPER_SNAKE_CASE:
  ```typescript
  PROMPT_METADATA_PARSE_ERRORS = {
      INVALID_FORMAT: 'INVALID_FORMAT',
      NO_PROMPTS: 'NO_PROMPTS',
  }
  ```

### 일반 상수
- UPPER_SNAKE_CASE: `PROFILE_STORAGE_TREE`, `HISTORY_VERSION`, `MESSAGES_VERSION`
- 또는 camelCase (설정 기본값 등): `defaultConfig`, `defaultCache`

---

## Import Path Alias

### 패키지별 alias
- **core**: `@/*` -> `src/*`
- **electron**: `@/*` -> `src/*`, `@utils` -> `src/utils/index`, `@features/*` -> `src/features/*`
- **front**: `@/*` -> `src/*`
- 외부 패키지: `@afron/types`, `@afron/core`, `@afron/chatai-models`
