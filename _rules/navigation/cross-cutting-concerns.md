# Cross-cutting Concerns

## 1. 로깅 (Logging)

### Electron 메인 프로세스

- **구현**: `@afron/core` > `AfronLogger` 클래스
- **위치**: `packages/core/src/features/logger/AfronLogger.ts`
- **특징**:
  - `@hve/channel` 기반 비동기 producer-consumer 패턴으로 로그 큐잉
  - 파일 기반 로깅 (`log-{날짜}.txt`)
  - 6단계 레벨: TRACE, DEBUG, INFO, WARN, ERROR, FATAL
  - `verbose` 옵션 활성화 시 콘솔에도 출력
  - `LevelLogger` 인터페이스 구현 (`packages/core/src/types/`)
- **접근 방법**: `runtime.logger`를 통해 접근 (런타임 레지스트리 싱글턴)
- **사용 패턴**:
  ```typescript
  runtime.logger.info('Afron is starting...');
  runtime.logger.trace('[Electron][app] window-all-closed');
  runtime.logger.error('Error during app quit:', error);
  ```

### NoLogger

- `packages/core/src/features/nologger/` - 아무 동작도 하지 않는 로거
- RT 내보내기/가져오기 등에서 로거가 선택적일 때 사용

### 프론트엔드

- 프론트엔드에는 별도 로깅 시스템 없음
- `console.log/warn/error` 직접 사용

## 2. 설정 (Configuration)

### Electron 환경 설정

- **위치**: `packages/electron/src/runtime/registry.ts` > `env` 객체
- **타입**: `AfronEnv` (`packages/electron/src/runtime/types.ts`)
- **초기화**: `packages/electron/src/initialize/initAfronEnv.ts`
- **주요 설정**:
  - `dev` - 개발 모드 여부
  - `devUrl` - 개발 서버 URL (기본 `http://localhost:3600`)
  - `inMemory` - 인메모리 모드
  - `showDevTool` - DevTools 표시
  - `skipMasterKeyInitialization` - 마스터키 초기화 건너뛰기
  - `logTrace`, `logVerbose` - 로그 레벨 설정
- **소스**: `.env` 파일 + 환경 변수 (`ELECTRON_DEV`, `ELECTRON_IN_MEMORY` 등)

### 프론트엔드 설정

- **Zustand 스토어**: `useConfigStore` (`packages/front/src/stores/useConfigStore.ts`)
- **저장**: 프로필별 `config.json`에 영구 저장 (profileStoreTool 유틸리티 사용)
- **주요 설정**: 폰트 크기, 테마, 레이아웃, 히스토리, 텍스트영역 비율, 모델 표시 옵션 등
- **패턴**: `profileStoreTool`이 IPC를 통한 저장/로드를 자동화

### 글로벌 저장소

- `runtime.globalStorage` (IACStorage) - ac-storage 기반
- 프로필에 무관한 앱 전역 설정 저장
- IPC를 통해 프론트에서도 접근 가능 (`globalStorage.get/set`)

## 3. 에러 전파 (Error Propagation)

### IPC 계층 에러 처리 (핵심 패턴)

모든 IPC 통신은 **에러-우선 튜플 패턴** `[err, result]`을 사용한다:

1. **Electron main** (`initIPC.ts`):
   ```typescript
   // 모든 IPC 핸들러가 try-catch로 감싸짐
   try {
       const result = await callback(...args);
       return result;  // 핸들러가 직접 [null, data] 또는 [errorObj] 반환
   } catch (error) {
       return [makeErrorStruct(error)];  // { name, message } 구조
   }
   ```

2. **Preload** (`preload.ts`):
   - `ipcRenderer.invoke()` 결과를 그대로 전달

3. **프론트엔드 API 래퍼** (`ElectronIPCAPI.ts`):
   ```typescript
   const [err, data] = await electron.{category}.{method}(...args);
   if (err) throw new IPCError(err.message);
   return data;
   ```

### 프론트엔드 에러 처리

- `IPCError` 클래스로 IPC 에러를 래핑
- `useErrorLogStore` - 에러 로그 수집 스토어
- `ErrorLogModal` - 에러 로그 표시 모달
- `ErrorLogButton` - 헤더에 에러 로그 버튼

### core 패키지 에러 처리

- 기능별 커스텀 에러 클래스 사용
  - `packages/core/src/features/rt-packer/errors/` - RT 패커 에러
  - `packages/core/src/features/rt-worker/errors/` - RT 워커 에러
- 에러는 throw로 전파되며 IPC 레이어에서 포착

## 4. 이벤트 시스템 (Event System)

### 이벤트 파이프 (Front <- Electron)

프론트엔드에서 Electron 메인 프로세스의 비동기 이벤트를 수신하는 메커니즘:

- **RequestEventPipe** (`packages/front/src/api/events/RequestEventPipe.ts`):
  - RT 요청 실행 중 스트리밍 응답, 진행 상황, 미리보기 등의 이벤트
  - `@hve/channel` 기반
  
- **GlobalEventPipe** (`packages/front/src/api/events/GlobalEventPipe.ts`):
  - RT 내보내기/가져오기 진행 상황 등의 전역 이벤트

### RT 이벤트 (Electron 내부)

- `RTEventEmitter` (`packages/core/src/features/rt-worker/RTEventEmitter.ts`):
  - RT 실행 중 발생하는 이벤트를 발행
  - 스트리밍 텍스트, 미리보기 데이터 등
  
- `GlobalEventEmitter` (`packages/core/src/features/event-emitter/GlobalEventEmitter.ts`):
  - 전역 이벤트 발행 (내보내기/가져오기 등)

### 이벤트 전달 경로

```
[core] RTWorker/RTEventEmitter
    -> [electron] ElectronApp에서 리스너 등록
    -> [electron] win.webContents.send(IPCListenerPing.Request, ...)
    -> [front] preload의 ipcRenderer.on으로 수신
    -> [front] RequestEventPipe/GlobalEventPipe로 전달
    -> [front] useEventHandler 등 React 훅에서 소비
```

## 5. 상태 관리 (State Management)

### Electron 메인 프로세스: 런타임 레지스트리

- **패턴**: 전역 가변 싱글턴 객체
- **위치**: `packages/electron/src/runtime/registry.ts`
- **구성원**:
  - `profiles` - Profiles 인스턴스
  - `globalStorage` - IACStorage 인스턴스
  - `masterKeyManager` - MasterKeyManager 인스턴스
  - `rtWorker` - RTWorker 인스턴스
  - `eventProcess` - EventProcess 인스턴스
  - `ipcFrontAPI` - IPC 핸들러 인터페이스
  - `appVersionManager` - AppVersionManager 인스턴스
  - `migrationService` - MigrationService 인스턴스
  - `logger` - Logger 인스턴스
  - `version` - 앱 버전 문자열
  - `env` - 환경 설정 객체
- **초기화**: `initRegistry` -> `updateRegistry`로 점진적 등록

### 프론트엔드: Zustand 스토어

- **패턴**: `create()` 함수로 생성하는 Zustand 스토어
- **주요 스토어**:
  | 스토어 | 역할 |
  |--------|------|
  | `useProfileAPIStore` | 현재 프로필 API 인스턴스 |
  | `useConfigStore` | 프로필 설정 (영구 저장) |
  | `useDataStore` | 프로필 데이터 (커스텀 모델, 세션 목록, API 키 등) |
  | `useCacheStore` | 캐시 데이터 |
  | `useSessionStore` | 현재 세션 상태 |
  | `useHistoryStore` | 대화 히스토리 |
  | `useChannelStore` | Channel 인스턴스 |
  | `useGlobalConfigStore` | 글로벌 설정 |
  | `useShortcutSignalStore` | 단축키 신호 |
  | `useMemoryStore` | 메모리 상태 (profileId, allModels, version 등) |
  | `useErrorLogStore` | 에러 로그 |

- **영구 저장 패턴**: `profileStoreTool` 유틸리티가 Zustand 스토어를 IPC를 통해 프로필 저장소와 동기화

### 프론트엔드 API 계층: 싱글턴 패턴

- `ElectronIPCAPI.getInstance()` - IPC 통신 싱글턴
- `ProfilesAPI.getInstance()` - 프로필 API 싱글턴
- `RequestAPI.getInstance()` - 요청 API 싱글턴
- `RequestEventPipe.getInstance()` / `GlobalEventPipe.getInstance()` - 이벤트 파이프 싱글턴

## 6. 데이터 영구 저장 (Persistence)

### ac-storage

- `ac-storage` 라이브러리를 사용한 파일 기반 Key-Value 스토리지
- `IACStorage` 인터페이스
- 주요 사용:
  - `runtime.globalStorage` - 글로벌 설정
  - `Profile` 내부 - 프로필별 설정, RT 데이터

### SQLite (better-sqlite3)

- `HistoryAccessor` (`packages/core/src/features/acstorage-accessor/HistoryAccessor/`)를 통해 대화 히스토리 저장
- SQLite 데이터베이스 파일 기반

### 마스터키 암호화

- `MasterKeyManager` (`packages/core/src/features/masterkey-manager/`)
- `SecretJSONAccessor` - 암호화된 JSON 저장소
- API 키 등 민감 정보를 마스터키로 암호화하여 저장

## 7. 앱 라이프사이클

### 초기화 흐름 (Electron)

```
main.ts
  -> initialize()
    -> initPath()           # 프로그램 경로 설정
    -> initAfronEnv()       # 환경 변수 읽기
    -> initRegistryPriority()  # 로거 등 우선 초기화
    -> initRegistry()       # 핵심 서비스 초기화
    -> initRegistryWithEnv() # 환경별 설정
    -> initIPC()            # IPC 핸들러 등록
    -> initDevOptions()     # 개발 옵션 (마스터키 스킵 등)
  -> ElectronApp.run()
    -> BrowserWindow 생성
    -> 이벤트 리스너 등록
    -> 프론트엔드 로드
```

### 초기화 흐름 (프론트엔드)

```
main.tsx
  -> App.tsx
    -> Phase: Boot
      -> Bootstrap 컴포넌트 (useInitialize)
      -> 부팅 완료
    -> Phase: ProfileSelect
      -> ProfileSelectPage
      -> 프로필 선택/생성
    -> Phase: Login
      -> ProfileAPI 설정 (useProfileAPIStore)
      -> 프로필 데이터 로드
    -> Phase: Main
      -> Hub (HashRouter)
        -> Route "/" -> Home
        -> Route "/prompt/:rtId" -> PromptEditor
        -> Route "/workflow/:rtId" -> WorkflowEditor
```

## 8. 라우팅 (프론트엔드)

- `react-router-dom` 의 `HashRouter` 사용 (Electron file:// 프로토콜 호환)
- 라우트 정의: `packages/front/src/pages/Hub.tsx`

| 경로 | 컴포넌트 | 설명 |
|------|----------|------|
| `/` | `Home` | 메인 홈 (IO 섹션, 세션 관리) |
| `/test` | `TestPage` | 테스트/디버그 |
| `/prompt/:rtId` | `PromptEditor` | 프롬프트 편집기 |
| `/workflow/:rtId` | `WorkflowEditor` | 워크플로우 편집기 |
| `/workflow/:rtId/prompt/:promptId` | `PromptEditor` | 워크플로우 내 프롬프트 편집 |

- `RTStoreContextProvider`가 PromptEditor와 WorkflowEditor를 감싸 RT 상태 공유

## 9. 국제화 (i18n)

- `i18next` + `react-i18next` 사용
- 번역 파일: `packages/front/src/locales/{ko,en}/`
- 초기화: `packages/front/src/locales/` (main.tsx에서 import)
- 지원 언어: 한국어(ko), 영어(en)
