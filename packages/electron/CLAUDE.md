# @afron/electron - Code Conventions & Architecture

## 📦 패키지 개요

**목적**: Electron 메인 프로세스 및 애플리케이션 오케스트레이션

**역할**:
- BrowserWindow 생명주기 관리
- IPC (Inter-Process Communication) 레이어
- 파일 시스템 경로 관리
- 플랫폼별 기능 처리
- Core 비즈니스 로직과 UI 연결
- 초기화 및 런타임 레지스트리

**기술 스택**:
- Electron 37.2.3
- TypeScript (Strict mode)
- Rollup (빌드)
- Jest/TS-Jest (테스팅)

**의존성**:
- `@afron/core` (비즈니스 로직)
- `@afron/types` (타입 정의)
- `@afron/chatai-models` (모델 메타데이터)

---

## 📁 디렉토리 구조

```
packages/electron/
├── src/
│   ├── main.ts                    # 진입점
│   ├── data/                      # 상수 및 데이터 정의
│   ├── features/                  # Feature 모듈
│   │   ├── elctron-app/          # 메인 앱 오케스트레이션
│   │   ├── event-process/        # RT import/export 이벤트
│   │   ├── migration-service/    # 레거시 데이터 마이그레이션
│   │   ├── program-path/         # 경로 관리
│   │   ├── throttle-action/      # Throttled 저장
│   │   └── unique-store/         # Singleton 설정 저장소
│   ├── initialize/               # 초기화 모듈
│   │   ├── initialize.ts         # 메인 초기화 오케스트레이터
│   │   ├── initPath.ts           # 경로 초기화
│   │   ├── initRegistry.ts       # 레지스트리 초기화
│   │   └── ...
│   ├── ipc/                      # IPC 통신 레이어
│   │   ├── handlers/             # IPC 핸들러 구현
│   │   │   ├── general.ts
│   │   │   ├── profiles.ts
│   │   │   ├── profileRT.ts
│   │   │   ├── request.ts
│   │   │   └── ...
│   │   └── initIPC.ts           # IPC 등록
│   ├── preload/                  # Preload 스크립트
│   │   └── preload.ts           # Renderer용 안전한 IPC bridge
│   ├── runtime/                  # 글로벌 런타임 레지스트리
│   │   ├── index.ts
│   │   └── types.ts
│   ├── types/                    # TypeScript 타입
│   └── utils/                    # 유틸리티 함수
├── static/                       # 정적 에셋
│   ├── favicon.ico
│   └── index.html
├── build/                        # 빌드 설정
│   └── entitlements.mac.plist
├── package.json
├── tsconfig.json
└── forge.config.js               # Electron Forge 설정
```

**조직화 원칙**:
- Feature-based 아키텍처
- 명확한 관심사 분리 (IPC, 초기화, 런타임, features)
- 중앙집중식 런타임 레지스트리
- 모듈화된 초기화

---

## 📝 코드 컨벤션

### 1. 파일 네이밍

| 파일 타입 | 규칙 | 예시 |
|----------|------|------|
| 클래스 파일 | `PascalCase.ts` | `ElectronApp.ts`, `ProgramPath.ts`, `UniqueStore.ts` |
| 함수/유틸리티 | `camelCase.ts` | `initIPC.ts`, `initPath.ts`, `throttle.ts` |
| Feature 디렉토리 | `kebab-case/` | `elctron-app/`, `event-process/`, `throttle-action/` |
| 데이터/상수 | `lowercase` | `data/`, `types/` |
| Index 파일 | `index.ts` | Barrel exports |
| 템플릿 | `__template.ts` | IPC handler 보일러플레이트 |

**규칙**:
- 클래스 파일은 클래스명과 일치 (PascalCase)
- 초기화 파일은 `init*` 접두사
- Feature는 kebab-case 디렉토리

### 2. 클래스 & 함수 네이밍

#### 클래스: `PascalCase`

```typescript
class ElectronApp
class ThrottleAction
class UniqueStore
class ProgramPath
class EventProcess
```

**Singleton 패턴**: `getInstance()` static 메서드

```typescript
ThrottleAction.getInstance()
```

#### 함수: `camelCase`

```typescript
initIPC()
initPath()
initRegistry()
handleIPC()
```

**Async 함수**: 특별한 접두사 없음 (단지 `async` 표시)

#### IPC Handler 패턴

```typescript
// 팩토리 함수 반환
function handler(): IPCInvokers.Category {
    return {
        async methodName(...args) {
            return [null, result] as const;  // 또는 [error]
        }
    }
}
```

#### Private 필드/메서드: `#` 접두사

```typescript
#setupWindowHandler()
#createBrowserWindow()
#logger
#basePath
```

#### 변수 & 상수

```typescript
// camelCase
const programPath = ProgramPath.getInstance();
const masterKeyManager = MasterKeyManager.From();

// UPPER_SNAKE_CASE (상수)
const MINIMUM_WINDOW_SIZE = { width: 800, height: 600 };
const DEFAULT_WINDOW_SIZE = { width: 1200, height: 800 };
const FAVICON = 'static/favicon.ico';

// 런타임 레지스트리 접근
runtime.profiles
runtime.logger
```

#### 타입 네이밍

```typescript
// PascalCase
interface RuntimeRegistry
interface IPCInvokerInterface
type AfronEnv

// Props 접미사
type InitRegistryProps
type InitRegistryPriorityProps
```

---

## 🏗️ 아키텍처 패턴

### 전체 아키텍처

**Thin Orchestration Layer over @afron/core**:
- Core는 비즈니스 로직 처리
- Electron은 UI 생명주기, IPC, 플랫폼 로직 처리
- 깔끔한 분리로 UI 프레임워크 교체 가능

### 주요 아키텍처 결정

#### 1. Runtime Registry Pattern

```typescript
// 중앙집중식 글로벌 상태
import runtime from '@/runtime';

const { profiles, logger } = runtime;
```

**장점**:
- 모든 서비스에 타입 안전한 접근
- 순환 의존성 방지
- 명확한 초기화 순서

#### 2. Railway-Oriented Programming (Tuple Returns)

```typescript
// 모든 IPC 핸들러는 튜플 반환
type Result = [error] | [null, data]

// 성공
return [null, result] as const;

// 실패
return [error] as const;
```

**장점**:
- IPC 경계를 넘어 예외 던지지 않음
- Renderer에서 명시적 에러 처리 강제
- 타입 안전한 에러 전파

#### 3. Dependency Injection via Registry

```typescript
// 서비스는 시작 시 초기화 및 등록
function initRegistry() {
    const logger = Logger.From();
    const profiles = await Profiles.From(...);

    updateRegistry({ logger, profiles });
}
```

**장점**:
- 유연한 초기화 순서
- 테스트를 위한 쉬운 모킹 (예: `MockMasterKeyManager`)

#### 4. Feature-Based Architecture

각 feature는 자체 포함 모듈:

```
feature-name/
├── FeatureName.ts    # 메인 구현
├── index.ts          # Barrel export
├── types.ts          # Feature별 타입 (optional)
└── ...
```

#### 5. Type-Safe IPC Bridge

```typescript
// @afron/types 패키지로 공유 타입
// preload에서 컴파일 타임 검증
const ipcInvokerPath = {
    profiles: {
        create: 'profiles_create',
        delete: 'profiles_delete',
        // ...
    }
} satisfies IPCInvokerPath;
```

**장점**:
- 컴파일 타임 IPC API 검증
- Preload와 메인 프로세스 동기화
- 런타임 문자열 연결 오류 없음

---

## 🔌 IPC (Inter-Process Communication) 패턴

### IPC 구조

**Category-based Handler 패턴**:

```typescript
// 핸들러 조직: category → methods
{
  general: { echo, openBrowser, getCurrentVersion, ... },
  profiles: { create, delete, getIds, ... },
  profileRT: { getMetadata, setMetadata, ... },
  request: { requestRT, previewPrompt, abort }
}
```

### Handler 구현 패턴

```typescript
// handlers/categoryName.ts
function handler(): IPCInvokers.CategoryName {
    return {
        async methodName(...args) {
            const { logger, profiles } = runtime;

            try {
                // 로직 구현
                const result = await profiles.someMethod(args);
                return [null, result] as const;
            } catch (error) {
                return [error] as const;
            }
        }
    }
}

export default handler;
```

### IPC 등록

```typescript
// initIPC.ts에서 자동 등록
for (const category in handlers) {
    for (const invokeKey in handlers[category]) {
        const ping = `${category}_${invokeKey}`;
        handleIPC(ping, handlers[category][invokeKey]);
    }
}
```

**채널 네이밍**: `${category}_${method}` (예: `profiles_create`)

### Preload Bridge

```typescript
// preload/preload.ts
const ipcExports = {
    invoke: (ping: string, ...args: any[]) => {
        return ipcRenderer.invoke(ping, ...args);
    },
    on: (channel: string, callback: (...args: any[]) => void) => {
        return ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
};

contextBridge.exposeInMainWorld('electron', ipcExports);
```

**보안**:
- Context isolation 활성화
- `contextBridge`로 안전한 IPC 노출
- Renderer에 제한된 API surface

### 에러 처리

```typescript
// initIPC.ts에서 자동 에러 캐치
try {
    const result = await callback(...args);
    return result;
} catch (error: any) {
    runtime.logger.error('IPCError:', ping, ...args);
    runtime.logger.error(error);
    return [makeErrorStruct(error)];  // 직렬화 가능한 에러
}

function makeErrorStruct(error: any) {
    try {
        return { name: error.name, message: error.message }
    } catch {
        return { name: 'UnknownError', message: 'Unknown error' }
    }
}
```

### 로깅

```typescript
// 모든 IPC 호출 로깅
runtime.logger.trace('IPCCall:', ping, ...args);

// 에러 로깅
runtime.logger.error('IPCError:', ping, ...args);
```

---

## ⚡ 이벤트 처리 패턴

### 이벤트 타입

#### 1. Electron App Events

```typescript
// ElectronApp.ts
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        this.#createBrowserWindow();
    }
});

app.on('will-quit', async () => {
    // Cleanup: 단축키 해제, 데이터 저장
});
```

#### 2. Window Events

```typescript
window.on('resize', () => {
    // Throttled 저장
    ThrottleAction.getInstance().throttle('window-size', async () => {
        await saveWindowSize();
    });
});

window.on('close', () => {
    // Cleanup 로깅
});
```

#### 3. IPC Listeners (Renderer → Main)

```typescript
// Preload에서 관리
createListenerManager('Request')
createListenerManager('Global')
createListenerManager('Debug')

// Main에서 발송
window.webContents.send(IPCListenerPing.Request, event);
```

#### 4. RT Events (Main → Renderer)

```typescript
// WeakRef로 메모리 안전성
const windowRef = new WeakRef(window);

rtWorker.addRTEventListener((event) => {
    const win = windowRef.deref();
    if (win) {
        win.webContents.send(IPCListenerPing.Request, event);
    }
});
```

### Throttling

```typescript
// ThrottleAction singleton
const throttler = ThrottleAction.getInstance();

throttler.throttle('resource-id', async () => {
    await performExpensiveOperation();
}, 1000); // 1초 throttle
```

**사용처**:
- Window resize (500ms)
- 저장 작업 (1000ms)
- 리소스별 throttling (프로필, 글로벌 등)

---

## 🚀 초기화 & 시작 패턴

### Startup Flow

```typescript
// main.ts
async function main() {
    // 1. Single instance lock 확인
    const gotTheLock = app.requestSingleInstanceLock();
    if (!gotTheLock) {
        app.quit();
        return;
    }

    // 2. 멀티 페이즈 초기화
    await initialize();

    // 3. 앱 시작
    await new ElectronApp().run();
}

app.whenReady().then(main);
```

### 초기화 페이즈

```typescript
// initialize/initialize.ts
export default async function initialize() {
    // 우선순위 순서 중요!
    initPath();                // 1. 파일 경로 설정
    initAfronEnv();            // 2. 환경 설정 로드
    await initRegistryPriority(); // 3. Logger 초기화 (높은 우선순위)
    await initRegistry();         // 4. 핵심 서비스 초기화
    await initRegistryWithEnv();  // 5. 스토리지 & 프로필 초기화
    initIPC();                    // 6. IPC 핸들러 등록
    initDevOptions();             // 7. Dev 전용 설정
}
```

### 환경 설정

**개발 환경** (`.env` 파일):
- `AFRON_DEV`: URL에서 프론트엔드 로드
- `AFRON_IN_MEMORY`: 휘발성 스토리지
- `AFRON_SHOW_DEVTOOL`: DevTools 자동 열기
- `AFRON_DEFAULT_PROFILE`: 기본 프로필 생성
- `AFRON_LOG_TRACE`: Trace 로깅 활성화

**프로덕션**: 최소 설정, dev 기능 없음

### Storage 초기화

```typescript
// Production
const storage = await ACStorage.From(basePath);

// In-memory (dev/test)
const storage = new MemACStorage();

// Schema 등록
storage.registerSchema(...);

// Custom access handlers
storage.register('profiles', new ProfilesAccessor());
```

---

## 🔧 Export 패턴

### Barrel Exports

```typescript
// features/feature-name/index.ts
import FeatureName from './FeatureName';
export default FeatureName;

// 또는
export { updateRegistry } from './registry';
export { formatDateLocal, openBrowser } from './utils';
```

### IPC Handler Aggregation

```typescript
// handlers/index.ts
import general from './general';
import profiles from './profiles';
import profileRT from './profileRT';
// ...

export default function get(): IPCInvokerInterface {
    return {
        general: general(),
        profiles: profiles(),
        profileRT: profileRT(),
        // ...
    }
}
```

### Type Exports

```typescript
export type { RuntimeRegistry, AfronEnv } from './types';
```

---

## 🛡️ 보안 관행

1. **Context Isolation**: BrowserWindow에서 활성화
2. **Preload Script**: `contextBridge`로 안전한 IPC 노출
3. **제한된 API Surface**: Renderer에 최소 API만 노출
4. **Master Key Management**: 민감 데이터의 암호화 스토리지
5. **Path Validation**: 사용 전 모든 파일 경로 검증
6. **Single Instance Lock**: 여러 앱 인스턴스 방지
7. **Error Sanitization**: Renderer로 보내기 전 에러 직렬화

---

## 🎯 주요 Features

### 1. ElectronApp

- BrowserWindow 생명주기 관리
- 앱/윈도우 이벤트 핸들러
- Dev vs 프로덕션 모드

### 2. ThrottleAction

- Throttled 저장 작업
- 과도한 디스크 I/O 방지
- 프로필별 및 글로벌 throttling

### 3. UniqueStore

- 앱 전역 설정 (저장 경로)
- 플랫폼별 기본값
- 경로 검증

### 4. ProgramPath

- 런타임 경로 관리
- 필요한 디렉토리 생성
- 공통 경로 getters

### 5. EventProcess

- 장기 실행 프로세스 (import/export)
- 진행 상황 업데이트
- WeakRef로 메모리 안전성

### 6. MigrationService

- 레거시 데이터 감지
- 새 포맷으로 변환
- 일회성 마이그레이션 플래그

---

## 💡 개발자 가이드

### 네이밍 체크리스트

- [ ] 클래스: `PascalCase`
- [ ] 함수: `camelCase`
- [ ] Private 필드: `#camelCase`
- [ ] 상수: `UPPER_SNAKE_CASE`
- [ ] Feature 디렉토리: `kebab-case/`
- [ ] 초기화 함수: `init*` 접두사

### IPC 핸들러 작성

1. `handlers/` 디렉토리에 새 파일 생성
2. Factory 함수로 핸들러 객체 반환
3. Tuple 패턴으로 에러 처리
4. `handlers/index.ts`에 등록
5. `@afron/types`에 타입 정의 추가

```typescript
// handlers/newFeature.ts
function handler(): IPCInvokers.NewFeature {
    return {
        async method(arg1, arg2) {
            const { logger } = runtime;
            try {
                // 로직
                return [null, result] as const;
            } catch (error) {
                return [error] as const;
            }
        }
    }
}
export default handler;

// handlers/index.ts
import newFeature from './newFeature';
export default function get() {
    return {
        // ...
        newFeature: newFeature(),
    }
}
```

### Best Practices

1. ✅ 모든 IPC 핸들러는 tuple 반환
2. ✅ Runtime 레지스트리로 서비스 접근
3. ✅ WeakRef로 BrowserWindow 저장
4. ✅ Throttling으로 I/O 최적화
5. ✅ Context isolation 유지
6. ✅ 모든 에러 로깅
7. ✅ 플랫폼별 차이 처리

---

## 📊 통계

- **IPC 핸들러 카테고리**: 10+ 카테고리
- **Feature 모듈**: 6개
- **초기화 페이즈**: 7단계
- **플랫폼 지원**: Windows, macOS, Linux

---

## ✨ 핵심 특징

이 코드베이스는 다음을 보여줍니다:

✅ **명확한 관심사 분리** - IPC, 초기화, features 구분
✅ **타입 안전한 IPC** - Compile-time 검증
✅ **견고한 에러 처리** - Railway-oriented programming
✅ **메모리 안전성** - WeakRef 사용
✅ **확장 가능한 구조** - Feature-based 조직화
✅ **포괄적인 로깅** - 모든 IPC 호출 및 에러
✅ **플랫폼 최적화** - OS별 처리
✅ **개발 편의성** - Hot reload, mock 서비스
✅ **보안 우선** - Context isolation, sanitization
✅ **깔끔한 통합** - Core 비즈니스 로직과 분리

---

**마지막 업데이트**: 2025-11-09
