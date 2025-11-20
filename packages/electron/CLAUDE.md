# packages/electron

Electron 메인 프로세스. 프론트엔드에 IPC API를 노출하고, @afron/core의 비즈니스 로직을 연결.

## 외부 노출 인터페이스

### 1. window.electron API (프론트엔드)

**타입 정의**: `@afron/types` → `IPCInterface`
- `packages/types/types/ipc/interface.d.ts` - 최상위 인터페이스
- `packages/types/types/ipc/invokers.d.ts` - 모든 IPC 메서드 시그니처

**프론트엔드 선언**: `packages/front/src/electron-ipc.d.ts`
```typescript
declare global {
  interface Window {
    electron: IPCInterface;
  }
}
```

**카테고리별 API**:
```typescript
window.electron = {
  // 카테고리: 메서드들
  general: { echo, openBrowser, getCurrentVersion, getChatAIModels, ... },
  masterKey: { init, reset, recover },
  profiles: { create, delete, getIds, getLast, setLast, ... },
  profile: { getCustomModels, setCustomModel, getGlobalModelConfig, ... },
  profileStorage: { get, set, getAsText, setAsBinary, setAsSecret, ... },
  profileSessions: { add, remove, getIds, reorder, ... },
  profileSession: { getFormValues, setFormValues },
  profileSessionStorage: { get, set, addInputFile, getInputFilePreviews, ... },
  profileSessionHistory: { get, search, getMessage, delete, ... },
  profileRTs: { getTree, updateTree, createUsingTemplate, remove, importFile, exportFile, ... },
  profileRT: { getMetadata, setMetadata, getForms, ... },
  profileRTStorage: { get, set },
  profileRTPrompt: { getMetadata, setMetadata, getVariables, setVariables, getContents, setContents, ... },
  profileRTFlow: { getFlowData, setFlowData, getPrompts, addPrompt, removePrompt, ... },
  request: { requestRT, previewPrompt, abort },

  // 이벤트 리스너
  events: {
    onRequest(listener),  // RTWorker 실행 이벤트
    onGlobal(listener),   // 전역 이벤트
    onDebug(listener),    // 디버그 이벤트
    off(bindId)           // 리스너 해제
  }
}
```

### 2. 응답 타입

모든 IPC 메서드는 `EResult<T>` 또는 `ENoResult` 반환:
```typescript
// 성공 시
Promise<[null, T]>        // EResult<T>
Promise<[null]>           // ENoResult

// 실패 시
Promise<[{ name, message }]>
```

**프론트엔드 사용 예**:
```typescript
const [err, data] = await window.electron.profileRT.getMetadata(profileId, rtId);
if (err) {
  // 에러 처리
} else {
  // data 사용
}
```

## IPC 구현 추적 경로

### 타입 정의 → 구현 → 노출 흐름

1. **타입 정의**: `@afron/types/types/ipc/invokers.d.ts`
   - 예: `ProfileRT.getMetadata(profileId, rtId): EResult<RTMetadata>`

2. **핸들러 구현**: `packages/electron/src/ipc/handlers/profileRT.ts`
   - 실제 로직 구현, `@afron/core` 모듈 사용

3. **핸들러 등록**: `packages/electron/src/ipc/initIPC.ts`
   - `ipcMain.handle('profileRT_getMetadata', handler)` 형태로 등록
   - 호출 형식: `${category}_${method}`

4. **Preload 노출**: `packages/electron/src/preload/preload.ts`
   - `ipcInvokerPath` 객체에 메서드 목록 정의 (타입 체크용)
   - `contextBridge.exposeInMainWorld('electron', ipcExports)`

### 새 IPC 메서드 추가 시

1. `@afron/types/types/ipc/invokers.d.ts` - 타입 선언
2. `packages/electron/src/preload/preload.ts` - `ipcInvokerPath`에 메서드명 추가
3. `packages/electron/src/ipc/handlers/{category}.ts` - 핸들러 구현
4. 빌드 시 타입 미스매치로 누락 방지

## 의존성

### @afron/core
비즈니스 로직 실행을 위한 코어 모듈:
- **Profiles** - 프로필 관리
- **RTWorker** - 프롬프트 실행 엔진
- **MasterKeyManager** - 암호화 키 관리
- **AppVersionManager** - 버전 관리
- **Logger** - 로깅

**접근**: `runtime` 싱글톤 (src/runtime/types.ts)
```typescript
import runtime from '@/runtime';
runtime.profiles, runtime.rtWorker, runtime.logger, ...
```

### @afron/types
프론트엔드와 공유하는 타입:
- IPC 인터페이스 (`IPCInterface`, `IPCInvokerInterface`)
- RT 관련 타입 (`RTMetadata`, `RTVar`, `RTFlowData`)
- Storage 타입 (`ProfileStorage`, `GlobalModelConfiguration`)
- ChatAI 타입 (`ChatAIModelData`)

## 이벤트 전달 (Electron → Front)

**RTWorker 이벤트**:
- `src/features/elctron-app/ElectronApp.ts:55-63`
- RTWorker 실행 중 발생하는 이벤트를 `window.webContents.send()`로 전달
- 프론트엔드는 `window.electron.events.onRequest(listener)`로 수신

**이벤트 종류**:
- `IPCListenerPing.Request` - RT 실행 이벤트
- `IPCListenerPing.Global` - 전역 이벤트
- `IPCListenerPing.Debug` - 디버그 이벤트

## 주요 Features

### event-process/
RT Import/Export 파일 처리
- `RTExportProcess` - RT를 파일로 저장
- `RTImportProcess` - 파일에서 RT 로드

### migration-service/
레거시 AIFront 데이터 마이그레이션
- 구버전 프롬프트 파일 변환

### program-path/
파일 시스템 경로 관리
- 사용자 데이터 디렉토리 (profiles/, logs/, temp/)

## 참조 경로 요약

| 목적 | 경로 |
|------|------|
| IPC 타입 정의 | `@afron/types/types/ipc/invokers.d.ts` |
| 핸들러 구현 | `packages/electron/src/ipc/handlers/*.ts` |
| Preload API | `packages/electron/src/preload/preload.ts` |
| 프론트엔드 타입 | `packages/front/src/electron-ipc.d.ts` |
| IPC 등록 로직 | `packages/electron/src/ipc/initIPC.ts` |
| 이벤트 전달 | `packages/electron/src/features/elctron-app/ElectronApp.ts:55` |
