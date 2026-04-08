# Module Dependency Graph

## 패키지 간 의존성 관계

```
@afron/types          (의존성 없음 - 순수 타입 패키지)
    ^
    |
@afron/chatai-models  (types 의존)
    ^
    |
@afron/core           (types, chatai-models 의존)
    ^
    |
@afron/electron       (types, core, chatai-models 의존)

@afron/frontend       (types만 의존 - IPC를 통해 간접 소통)
```

### 의존성 방향 요약

| 패키지 | 내부 의존 | 주요 외부 의존 |
|--------|-----------|----------------|
| `@afron/types` | 없음 | 없음 |
| `@afron/chatai-models` | `@afron/types` | `tslib` |
| `@afron/core` | `@afron/types`, `@afron/chatai-models` | `ac-storage`, `@hve/channel`, `@hve/chatai`, `better-sqlite3`, `sharp`, `uuid` |
| `@afron/electron` | `@afron/types`, `@afron/core`, `@afron/chatai-models` | `electron`, `ac-storage`, `@hve/channel`, `dotenv`, `date-fns` |
| `@afron/frontend` | `@afron/types` | `react`, `zustand`, `react-router-dom`, `@xyflow/react`, `@hve/channel`, `i18next`, `@monaco-editor/react` |

## 핵심 외부 라이브러리 역할

| 라이브러리 | 역할 | 사용 위치 |
|------------|------|-----------|
| `ac-storage` | 파일 기반 Key-Value 스토리지 | core, electron |
| `@hve/channel` | 비동기 채널 (producer-consumer 패턴) | core (Logger), front (EventPipe, RequestAPI, stores) |
| `@hve/chatai` | ChatAI API 클라이언트 | core (ChatAIFetcher) |
| `@hve/mime` | MIME 타입 감지 | core |
| `zustand` | 프론트엔드 상태 관리 | front (stores) |
| `@xyflow/react` | 노드 기반 워크플로우 에디터 | front (WorkflowEditor) |
| `react-router-dom` | 클라이언트 사이드 라우팅 | front (Hub) |
| `better-sqlite3` | SQLite 데이터베이스 | core (HistoryAccessor) |
| `advanced-prompt-template-lang` | 프롬프트 템플릿 언어 파서 | core, front |
| `i18next` / `react-i18next` | 국제화 | front |

## 빌드 순서

`package.json`의 build 스크립트에 따른 순서:

```
1. chatai-models (yarn chatai:build)
2. core          (yarn core:build)
3. electron      (yarn electron:build)
4. front         (yarn front:build)
```

이 순서는 의존성 방향과 일치한다: types는 빌드 불필요(순수 .d.ts), chatai-models가 먼저, core가 그 다음, 나머지는 독립적이나 electron이 core에 의존하므로 그 다음.

## Electron <-> Front 통신 구조

Electron 메인 프로세스와 React 렌더러 프로세스 간의 통신은 IPC(Inter-Process Communication)를 통해 이루어진다.

```
[React Renderer]                    [Electron Main]
     |                                     |
     |  window.electron.{category}.{fn}    |
     |  -------------------------------->  |
     |  (ipcRenderer.invoke)               |  ipcMain.handle("{category}_{fn}")
     |                                     |  -> handlers/{category}.ts
     |  <--------------------------------  |
     |  [err, result] tuple                |
     |                                     |
     |  ipcRenderer.on(IPCListenerPing)    |
     |  <--------------------------------  |
     |  (이벤트 리스너: RT 이벤트 등)       |  win.webContents.send()
```

### IPC 통신 흐름

1. **Preload** (`packages/electron/src/preload/preload.ts`):
   - `contextBridge.exposeInMainWorld('electron', ipcExports)` 로 API 노출
   - `ipcInvokerPath` 객체에서 카테고리/메서드 경로를 자동으로 `ipcRenderer.invoke` 호출로 변환
   - 타입 안전성: `satisfies IPCInvokerPath` 로 빌드 시 타입 검증

2. **IPC 등록** (`packages/electron/src/ipc/initIPC.ts`):
   - `handlers/index.ts`에서 카테고리별 핸들러 조합
   - `{category}_{method}` 패턴으로 `ipcMain.handle` 등록
   - 모든 IPC 호출은 try-catch로 감싸져 에러를 `[errorStruct]` 형태로 반환

3. **프론트엔드 API 래퍼** (`packages/front/src/api/local/ElectronIPCAPI.ts`):
   - `window.electron` 호출을 래핑하는 싱글턴 클래스
   - `[err, result]` 튜플을 언팩하여 에러 시 `IPCError` throw

### IPC 카테고리 목록

| 카테고리 | 역할 |
|----------|------|
| `general` | 일반 (echo, 브라우저 열기, 버전 정보, AI 모델 목록, 마이그레이션) |
| `globalStorage` | 글로벌 저장소 get/set |
| `masterKey` | 마스터키 초기화/리셋/복구 |
| `profiles` | 프로필 CRUD, 목록, 고아 복구 |
| `profile` | 커스텀 모델, 글로벌 모델 설정 |
| `profileStorage` | 프로필별 저장소 (JSON, 텍스트, 바이너리, 시크릿) |
| `profileSessions` | 세션 추가/삭제/재정렬 |
| `profileSession` | 세션 폼 값 get/set |
| `profileSessionStorage` | 세션별 저장소, 입력 파일 관리 |
| `profileSessionHistory` | 대화 히스토리 조회/검색/삭제 |
| `profileRTs` | RT 트리, 추가/삭제, ID 관리, 내보내기/가져오기 |
| `profileRT` | RT 메타데이터, 폼 조회 |
| `profileRTStorage` | RT별 저장소 get/set |
| `profileRTPrompt` | 프롬프트 메타데이터, 변수, 내용 관리 |
| `profileRTFlow` | 워크플로우 플로우 데이터, 프롬프트 순서 |
| `request` | RT 요청 실행, 프롬프트 미리보기, 요청 중단 |

### 이벤트 리스너 (Main -> Renderer)

Preload에서 `IPCListenerPing` 채널로 이벤트 수신:
- `Request` - RT 요청 이벤트 (스트리밍 응답 등)
- `Global` - 글로벌 이벤트 (RT 내보내기/가져오기 진행상황 등)
- `Debug` - 디버그 이벤트
