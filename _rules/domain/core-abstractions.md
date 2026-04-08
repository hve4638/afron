# Core Abstractions

Afron은 다중 AI 모델(OpenAI, Anthropic, Google Gemini, VertexAI)을 지원하는 Electron 기반 챗봇 클라이언트이다. 아래는 시스템을 구성하는 핵심 추상화들이다.

## 패키지 의존 관계

```
@afron/types          -- 모든 패키지가 참조하는 공유 타입 정의 (d.ts)
@afron/chatai-models  -- AI 모델 카탈로그 정의 (depends on: types)
@afron/core           -- 비즈니스 로직 계층 (depends on: types, @hve/chatai, ac-storage)
@afron/locale         -- 로케일/국제화
@afron/electron       -- Electron main process (depends on: core, chatai-models, types)
@afron/frontend       -- React 프론트엔드 (depends on: types, zustand)
```

## 핵심 도메인 엔티티

### Profile (프로필)

가장 상위의 도메인 엔티티. 사용자의 모든 설정, 세션, RT, API 키를 소유한다.

- **클래스**: `Profile` (`packages/core/src/features/profiles/Profile/Profile.ts`)
- **생성 패턴**: `Profile.From(path, required)` 비동기 팩토리 메서드 (private constructor)
- **내부 구성**:
  - `ACStorage` -- 파일시스템 기반 구조화 저장소 (`ac-storage` 라이브러리)
  - `ProfileSessions` -- 세션 목록 관리
  - `ProfileRTs` (RTControl) -- RT 목록 관리
  - `ProfileModel` -- 모델별 설정 관리
- **저장 구조**: 디렉토리 기반. 각 Profile은 `profile_N/` 디렉토리를 가진다
- **생명주기**: `From()` -> `initialize()` -> `commit()` / `drop()`

### Profiles (프로필 목록 관리자)

복수 Profile을 관리하는 컨테이너.

- **클래스**: `Profiles` (`packages/core/src/features/profiles/Profiles.ts`)
- **역할**: Profile 생성/삭제/조회, 마지막 사용 Profile 추적, 고아 Profile 복구
- **저장**: `profiles.json`에 메타데이터 저장 (profiles 배열, last_profile, next_profile_id)

### RT (Request Template / 요청 템플릿)

사용자가 AI에게 보내는 요청의 "틀"을 정의하는 핵심 엔티티. "프롬프트 엔지니어링"을 위한 추상화.

- **타입**: `RTMetadata` -- `{ name, id, mode: 'prompt_only' | 'flow' }`
- **두 가지 모드**:
  - `prompt_only`: 단일 프롬프트 템플릿 기반 실행
  - `flow`: 노드 그래프 기반 워크플로우 실행 (visual workflow editor)
- **관리 클래스**: `ProfileRT` (`packages/core/src/features/profiles/Profile/rt/ProfileRT.ts`)
  - 메타데이터, 프롬프트, 폼, 플로우 데이터 접근
  - `RTWorkflowControl`, `RTPromptControl` 하위 컨트롤러 보유
- **트리 구조**: `RTMetadataTree` -- node와 directory로 구성된 트리로 관리됨

### Session (세션)

하나의 대화 맥락. Profile 하위에 복수 존재.

- **관리 클래스**: `ProfileSessions`, `ProfileSession`
- **ID 생성**: UUIDv7 (시간순 정렬 가능)
- **저장 구조**: `session/{sessionId}/` 디렉토리
  - `config.json`: 이름, 모델 ID, RT ID, 색상
  - `cache.json`: 입력/출력 텍스트, 상태, 업로드 파일
  - `data.json`: 폼 값, 실행 중인 RT 정보
  - `history/`: SQLite 기반 대화 이력 (`HistoryAccessor` via `better-sqlite3`)
- **소프트 삭제**: 삭제 시 즉시 제거하지 않고 `removed_sessions` 목록으로 이동, 제한 수 초과 시 영구 삭제

### ChatAIModel (AI 모델)

시스템이 지원하는 AI 모델의 메타데이터.

- **타입**: `ChatAIModel` -- `{ metadataId, modelId, displayName, config, flags }`
- **config**: endpoint 타입, thinking 지원 여부, 스트리밍 지원, 안전 필터 등
- **계층 구조**: `ChatAIModelCategory > ChatAIModelGroup > ChatAIModel`
  - Category: OpenAI, Gemini, Anthropic, VertexAI
  - Group: 모델 시리즈 (GPT-4o, Claude 3.5 등)
  - Model: 개별 모델 (gpt-4o-2024-08-06 등)
- **선언**: `ModelDeclaration` 싱글톤이 Builder 패턴으로 전체 카탈로그 구성
- **커스텀 모델**: `CustomModel` 타입으로 사용자 정의 모델 지원 (`custom:` prefix)

### RTVar (RT 변수)

프롬프트 템플릿 내에서 사용되는 동적 변수 시스템.

- **변수 소스 타입** (`include_type`):
  - `form`: 사용자 UI 폼에서 입력받음
  - `constant`: 고정값
  - `external`: 외부 소스 (미구현)
- **데이터 타입** (`RTVarData.type`): `text`, `number`, `checkbox`, `select`, `array`, `struct`
- 각 타입별 설정 (`RTVarConfig`): default_value, placeholder, options, min/max 등

### MasterKey (마스터 키)

API 키 등 민감 데이터 보호를 위한 암호화 키 관리.

- **클래스**: `MasterKeyManager`
- **설계**: 하드웨어 식별자 기반 자동 복호화 + 복구 키 기반 수동 복구
- **초기화 상태**: `normal`, `need-recovery`, `no-data`, `invalid-data`
- **의존성**: `IMasterKeyGettable` 인터페이스로 Profile에 주입

## 핵심 설계 원칙

### ACStorage 기반 저장소 추상화

모든 영속 데이터는 `ac-storage` 라이브러리의 `ACStorage`를 통해 접근한다.

- **Storage Tree**: JSON 스키마 선언으로 저장소 구조를 정의 (`PROFILE_STORAGE_TREE`)
- **접근 방식**: `accessAsJSON()`, `accessAsText()`, `accessAsBinary()`, 커스텀 accessor
- **커스텀 accessor**: `history` (SQLite), `secret-json` (AES 암호화 JSON)
- **인메모리 모드**: `MemACStorage`로 파일시스템 없이 동작 (테스트/개발용)
- **SubStorage**: `storage.subStorage('request-template')`으로 하위 네임스페이스 분리

### 싱글톤 패턴 활용

- `ModelDeclaration.getInstance()` -- 모델 카탈로그
- `RequestManager.getInstance()` -- 프론트엔드 요청 관리
- `RequestAPI.getInstance()` -- IPC 요청 중계
- `ProfilesAPI.getInstance()` -- 프론트엔드 프로필 API

### Builder 패턴

- `ModelListBuilder > CategoryBuilder > GroupBuilder` -- 모델 카탈로그 구성
- `FormBuilder` -- ChatAI API 요청 폼 구성
- `RTPromptOnlyTemplateTool` / `RTFlowTemplateTool` -- RT 템플릿 초기 데이터 구성
