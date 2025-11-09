# @afron/frontend - Code Conventions & Architecture

## 📦 패키지 개요

**목적**: Afron Electron 애플리케이션의 React 프론트엔드

**역할**:
- 사용자 인터페이스 렌더링
- 상태 관리 (Zustand)
- Electron IPC 통신
- 프롬프트 편집기
- 워크플로우 에디터
- 세션 관리 UI
- 모달 및 다이얼로그 관리

**기술 스택**:
- React 18.3.1
- TypeScript 5.6.2
- Vite 5.4.10
- Zustand 5.0.3
- React Router 7.1.5
- SCSS Modules + Tailwind CSS 4.1.3

**의존성**:
- `@afron/types` (타입 정의)

---

## 📁 디렉토리 구조

```
packages/front/src/
├── api/                    # API 추상화 레이어 (IPC 통신)
│   ├── events/            # IPC 이벤트 핸들링
│   ├── local/             # Electron IPC API 래퍼
│   ├── profiles/          # 프로필 기반 API
│   └── request/           # 요청 처리
├── assets/                # 정적 에셋 (스타일, 이미지)
├── components/            # 재사용 가능한 UI 컴포넌트 (28개 하위 디렉토리)
│   ├── Button/
│   ├── Modal/
│   ├── forms/            # Form 컴포넌트
│   ├── ui/               # UI 프리미티브
│   └── ...
├── context/               # React 컨텍스트
├── features/              # Feature 모듈 (12개)
│   ├── bootstrap/        # 앱 초기화
│   ├── request-manager/  # 요청 오케스트레이션
│   ├── workflow/         # 워크플로우 에디터
│   └── ...
├── hooks/                 # 커스텀 React hooks
├── lib/                   # 유틸리티 라이브러리
├── locales/              # i18n 번역
├── modals/               # 모달 다이얼로그 (14개)
├── pages/                # 최상위 페이지 컴포넌트
│   ├── Home/
│   ├── PromptEditor/
│   ├── WorkflowEditor/
│   └── ProfileSelect/
├── stores/               # Zustand 상태 관리
│   └── local/           # 로컬/스코프 stores
├── types/                # TypeScript 타입 정의
└── utils/                # 유틸리티 함수
```

**통계**: 566개의 TypeScript 파일 (.ts/.tsx)

**조직화 원칙**:
- Feature-based modular architecture
- 명확한 관심사 분리
- 컴포넌트 재사용성
- 타입 안전성

---

## 📝 코드 컨벤션

### 1. 파일 네이밍

| 파일 타입 | 규칙 | 예시 |
|----------|------|------|
| 컴포넌트 파일 | `PascalCase.tsx` | `Button.tsx`, `Modal.tsx` |
| 컴포넌트 디렉토리 | `PascalCase/` | `Button/`, `Modal/` |
| Hooks | `camelCase.ts` (`use` 접두사) | `useModal.tsx`, `useEvent.ts` |
| Stores | `camelCase.ts` (`use` 접두사 + `Store` 접미사) | `useSessionStore.ts` |
| 스타일 | `.module.scss` | `styles.module.scss`, `Button.module.scss` |
| API/유틸리티 | `PascalCase.ts` (클래스), `camelCase.ts` (인스턴스) | `ProfilesAPI.ts` |

### 2. 컴포넌트 네이밍

#### 컴포넌트: `PascalCase`

```typescript
function Button({ ... }: ButtonProps) { }
function SessionTab({ ... }: SessionTabProps) { }
function HomePage({ ... }: HomePageProps) { }
```

#### Props 인터페이스: `{ComponentName}Props`

```typescript
interface ButtonProps {
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
    children?: React.ReactNode;
    disabled?: boolean;
}
```

#### 변수 네이밍

```typescript
// camelCase
const sessionId = 'abc123';
const profileAPI = new ProfileAPI();

// PascalCase (컴포넌트 참조)
const ModalComponent = SomeModal;

// SCREAMING_SNAKE_CASE (상수)
const DEFAULT_CONFIG = { ... } as const;
```

---

## ⚛️ React 컴포넌트 패턴

### Functional Components (100%)

모든 컴포넌트는 모던 함수형 컴포넌트 + Hooks:

```typescript
function Button({
    disabled = false,
    className = '',
    style = {},
    children,
    onClick = () => { }
}: ButtonProps) {
    return (
        <button className={classNames('button', 'btn-radius', className, { disabled })}>
            {children}
        </button>
    )
}
```

### 주요 패턴

#### 1. Default Props via Destructuring

```typescript
function StringForm({
    name,
    value,
    onChange,
    instantChange = false,  // 기본값
    disabled = false,       // 기본값
    className = '',         // 기본값
}: StringFormProps) {
    // ...
}
```

**규칙**: `defaultProps` 객체 사용하지 않음

#### 2. CommonProps Pattern

많은 컴포넌트가 공통 props 인터페이스 확장:

```typescript
interface CommonProps {
    className?: string;
    style?: React.CSSProperties;
}

interface ButtonProps extends CommonProps {
    onClick?: () => void;
    disabled?: boolean;
}
```

#### 3. Layout Component Primitives

재사용 가능한 레이아웃 컴포넌트:

```typescript
<Column>
    <Row>
        <span>Label</span>
        <Flex />
        <Input />
    </Row>
</Column>
```

**제공 컴포넌트**:
- `Row` - Horizontal flex
- `Column` - Vertical flex
- `Grid` - Grid layout
- `Flex` - Flexible spacer
- `Center` - Center alignment
- `Align` - Custom alignment

#### 4. Compound Component Pattern

Feature 폴더에 관련 컴포넌트 그룹화:

```
SessionTabBar/
├── SessionTabBar.tsx
├── SessionTab.tsx
├── AddTabButton.tsx
└── styles.module.scss
```

---

## 🏪 상태 관리

### Zustand (주요 상태 관리)

**Global Stores** (`/stores/`):

```typescript
// 세션 상태
useSessionStore

// 캐시 관리
useCacheStore

// 설정
useConfigStore

// 프로필 API 인스턴스
useProfileAPIStore

// 히스토리 관리
useHistoryStore

// IPC 채널 상태
useChannelStore

// 런타임 메모리
useMemoryStore

// 에러 로깅
useErrorLogStore

// 글로벌 설정
useGlobalConfigStore
```

**Local Stores** (`/stores/local/`):
- `rtStore.ts` - RT-scoped 상태
- 동적으로 RT 인스턴스별 생성

### Advanced Zustand Patterns

#### 1. Store with Actions and Dependencies

```typescript
export interface SessionState extends SessionFields {
    actions: {
        addInputFile(filename: string, base64Data: string): Promise<void>;
        updateInputFiles(fileHashes: InputFileHash[]): Promise<void>;
        refetchInputFiles(): Promise<void>;
    };
    deps: {
        api: ProfileAPI;
        last_session_id: string | null;
    };
    updateDeps: { /* ... */ };
    update: UpdateMethods<SessionFields>;
    refetch: RefetchMethods<SessionFields>;
    refetchAll: () => Promise<void>;
}
```

**특징**:
- `actions`: 비즈니스 로직 캡슐화
- `deps`: 외부 의존성 관리
- `update`: 필드별 업데이트 메서드
- `refetch`: 백엔드 동기화
- `refetchAll`: 전체 동기화

#### 2. Subscribe with Selector Middleware

```typescript
import { subscribeWithSelector } from 'zustand/middleware';

const useEventStore = create<EventFields, [['zustand/subscribeWithSelector', never]]>(
    subscribeWithSelector((set) => ({} as EventFields))
);
```

**장점**:
- 세밀한 구독 제어
- 선택적 리렌더링
- 성능 최적화

#### 3. Factory Functions for Scoped Stores

```typescript
export function createRTStore(rtId: string) {
    return create<RTState>((set, get) => ({
        rtId,
        // ... state
    }));
}

// 사용
const [useRTStore] = useState(() => createRTStore(rtId ?? 'unknown'));
```

### React Context (보조)

스코프별 상태에 사용:

```typescript
export const RTStoreContext = createContext<RTState | null>(null);

export function RTStoreContextProvider({ children }: { children: React.ReactNode }) {
    const { rtId } = useParams();
    const [useRTStore] = useState(() => createRTStore(rtId ?? 'unknown'));
    const store = useRTStore();

    return (
        <RTStoreContext.Provider value={store}>
            {children}
        </RTStoreContext.Provider>
    );
}
```

**Context 사용처**:
- `RTStoreContext` - RT 에디터 스코프 상태
- `RTPromptContext` - 프롬프트 에디터 스코프 상태
- `ModalContext` - 모달 관리

---

## 🛣️ 라우팅 패턴

**React Router v7** with HashRouter:

```typescript
function Hub() {
    return (
        <HashRouter>
            <HubEventHandler/>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/test' element={<TestPage />} />
                <Route
                    path="/prompt/:rtId"
                    element={
                        <RTStoreContextProvider>
                            <PromptEditor />
                        </RTStoreContextProvider>
                    }
                />
                <Route
                    path='/workflow/:rtId'
                    element={
                        <RTStoreContextProvider>
                            <WorkflowEditor />
                        </RTStoreContextProvider>
                    }
                />
            </Routes>
        </HashRouter>
    )
}
```

**패턴**:
- HashRouter (Electron 호환성)
- Route-level context providers (스코프별 상태)
- URL 파라미터는 `useParams()` 사용
- Router 레벨 이벤트 핸들러

**앱 페이즈**:

```typescript
const LoadPhase = {
    Boot: 'boot',
    ProfileSelect: 'ProfileSelect',
    Login: 'login',
    Main: 'main',
};
```

---

## 🎨 스타일링 규칙

### CSS Modules (주요)

컴포넌트별 스코프 스타일:

```typescript
import styles from './styles.module.scss';

<small className={classNames(styles['warn-messsage'], 'undraggable')} />
```

**파일 위치**:
- 컴포넌트별: `{Component}/styles.module.scss`
- 컴포넌트명: `Dropdown.module.scss`, `Button.module.scss`

**SCSS Module 예시**:

```scss
.modal-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);

    transition: opacity 0.15s;
    opacity: 1;

    &.disappear {
        opacity: 0.0;
    }
}
```

### Global SCSS Architecture

모듈식 SCSS (`/assets/style/`):

```scss
@use './module/index' as module;
@use './theme' as theme;
@use './flexstyle/index' as flexstyle;
@use './utils/index' as util;
@use './components/index' as components;
```

### Tailwind CSS (보조)

- Utility classes (빠른 레이아웃용)
- 주로 커스텀 SCSS 사용

### ClassNames Library

조건부 클래스에 사용:

```typescript
className={classNames(
    'button',
    'btn-radius',
    className,
    { disabled: disabled },
    { [colorStyle]: true },
    { selected }
)}
```

### Inline Styles

동적 스타일용:

```typescript
style={{
    width: '100%',
    height: '1.4em',
    ...style,
}}
```

---

## 🔌 IPC 통합 패턴

### Electron IPC API Wrapper

포괄적인 IPC 추상화 레이어:

```typescript
const electron = window.electron;

class ElectronIPCAPI implements IIPCAPI {
    general = {
        async echo(message: any) {
            const [_, data] = await electron.general.echo(message);
            return data;
        },
        // ... more methods
    };

    profiles = {
        async create() {
            const [err, id] = await electron.profiles.create();
            if (err) throw new IPCError(err.message);
            return id;
        },
        // ... more methods
    };

    // ... 더 많은 네임스페이스 API
}
```

**타입 선언**:

```typescript
// electron-ipc.d.ts
declare global {
    interface Window {
        electron: IPCInterface;
    }
}
```

### 주요 IPC 패턴

#### 1. Singleton Pattern

```typescript
const LocalAPIInstance: ElectronIPCAPI = ElectronIPCAPI.getInstance();
export default LocalAPIInstance;
```

#### 2. Error Tuple Pattern

```typescript
// IPC는 [error, data] 튜플 반환
const [err, data] = await electron.profiles.create();
if (err) throw new IPCError(err.message);
```

**변환**:
- Tuple → Exception (래퍼에서)
- 타입 안전한 에러 처리

#### 3. Namespaced API Organization

```typescript
// 네임스페이스별 구성
electron.general.*       // 일반 작업
electron.profiles.*      // 프로필 관리
electron.profile.*       // 단일 프로필 작업
electron.profileStorage.* // 프로필 스토리지
electron.profileSessions.* // 세션
electron.profileRTs.*    // Request Templates
electron.request.*       // 요청 실행
electron.events.*        // 이벤트 구독
```

#### 4. Profile API Layer

추가 추상화 레이어:

```typescript
class ProfilesAPI {
    profile(profileId: string) {
        if (!(profileId in this.#profiles)) {
            this.#profiles[profileId] = new ProfileAPI(profileId);
        }
        return this.#profiles[profileId];
    }
}

// 메서드 체이닝
ProfilesAPI.profile(profileId).session(sessionId).inputFiles.add(...)
```

---

## 🪟 모달/다이얼로그 패턴

### 커스텀 Modal System

React Context 기반 정교한 모달 관리:

```typescript
export function ModalProvider({children}: {children: React.ReactNode}) {
    const counter = useRef(0);
    const [modals, setModals] = useState<ModalData[]>([]);

    const openModalLegacy = <P extends {}>(
        modal: ModalComponentType<P>,
        props: Omit<P, 'onClose'|'isFocused'>
    ) => {
        const data: ModalData = {
            component: modal,
            key: counter.current++,
            props: props,
        }
        setModals((prev) => [...prev, data]);
    }

    return (
        <ModalContext.Provider value={{ open: openModalLegacy, count: modals.length }}>
            {children}
            {modals.map(({component: ModalComponent, key, props}, index) => (
                <ModalComponent
                    key={key}
                    {...props}
                    isFocused={index === modals.length - 1}
                    onClose={() => setModals((prev) => prev.filter((d) => d.key !== key))}
                />
            ))}
        </ModalContext.Provider>
    )
}
```

### Modal Hook

```typescript
const modal = useModal();
modal.open(SomeModal, { prop1: 'value' });
```

### Modal Component Pattern

```typescript
type ModalComponentType<P = {}> = React.ComponentType<{
    onClose: () => void,
    isFocused: boolean
} & P>;
```

### 기능

- 스택 기반 모달 관리
- Focus 관리 (마지막 모달에 포커스)
- `react-focus-lock`으로 focus trap
- ESC 키 처리
- 배경 클릭으로 닫기
- 부드러운 애니메이션 (fade/scale)

**Modal 위치**:
- 공유 모달: `/modals/` (14개 타입)
- 페이지별 모달: `/pages/{Page}/modals/`

---

## 📋 Form 처리 패턴

### Form Component Library

표준화된 form 컴포넌트 (`/components/forms/`):

- `StringForm` - 텍스트 입력
- `StringLongForm` - 긴 텍스트 입력
- `NumberForm` - 숫자 입력
- `SliderForm` - Range slider
- `DropdownForm` - Select dropdown
- `CheckBoxForm` - Checkbox
- `ToggleSwitchForm` - Toggle switch
- `ButtonForm` - 버튼 폼 필드
- `TextAreaForm` - 멀티라인 텍스트
- `HotkeyForm` - 키보드 단축키

### Form Component Pattern

```typescript
interface StringFormProps {
    name: string;
    value: string;
    onChange: (x: string) => void;
    instantChange?: boolean;
    className?: string;
    style?: React.CSSProperties;
    width?: string;
    warn?: string;
    disabled?: boolean;
}

function StringForm({ name, value, onChange, instantChange = false, ... }) {
    return (
        <Column>
            <Row>
                <span className='noflex undraggable'>{name}</span>
                <Flex />
                <TextInput
                    value={value}
                    onChange={onChange}
                    instantChange={instantChange}
                    disabled={disabled}
                />
            </Row>
            {warn && <small className={styles['warn-messsage']}>{warn}</small>}
        </Column>
    );
}
```

**주요 기능**:
- 일관된 label/input 레이아웃
- Optional instant change vs debounced
- 유효성 검증 경고
- Disabled 상태 지원
- 너비 커스터마이징

---

## 🔔 이벤트 시스템

### Custom Event Bus with Zustand

타입 안전한 이벤트 시스템:

```typescript
type Events = {
    font_size_up: ping;
    send_request: ping;
    copy_response: ping;
    create_tab: ping;
    input_file_upload: { file: File, latch: Latch };
    logging_error: LogEntry;
    show_toast_message: Toast;
    open_rt_preview_modal: RTEventPreviewData;
    // ... 더 많은 이벤트
};

const useEventStore = create<EventFields, [['zustand/subscribeWithSelector', never]]>(
    subscribeWithSelector((set) => ({} as EventFields))
);
```

### Event Hook

```typescript
export function useEvent<T extends EventNames>(
    key: T,
    callback: (value: Events[T]) => void,
    deps: React.DependencyList = [],
    enabled: boolean = true
) {
    useEffect(() => {
        if (!enabled) return;
        const unsub = useEventStore.subscribe(
            (data) => data[key],
            (value) => callback(value?.current),
        );
        return () => unsub();
    }, [...deps, enabled]);
}
```

### Emit Event

```typescript
emitEvent('refresh_session_metadata');
emitEvent('input_file_upload', { file, latch });
```

**기능**:
- 타입 안전한 이벤트명 및 페이로드
- React hook 통합
- 조건부 구독 (enabled 파라미터)
- 자동 cleanup

---

## 🪝 커스텀 Hooks

포괄적인 커스텀 hooks (`/hooks/`):

**Utility Hooks**:
- `useCache` - 값 캐싱
- `useDebounce` - Debounced 값
- `useThrottle` - Throttled 값
- `useLazyThrottle` - Lazy throttling
- `useDiff` - 값 diffing
- `useLatestRef` - 항상 최신 ref
- `useMemoRef` - Memoized ref
- `useTrigger` - 강제 리렌더

**UI Hooks**:
- `useModal` - 모달 관리
- `useModalDisappear` - 모달 사라짐 애니메이션
- `useMouseDelta` - 마우스 이동 추적
- `useHotkey` - 키보드 단축키 처리

**Data Hooks**:
- `useEvent` - 이벤트 구독
- `useStorage` - Local storage
- `useCache` - 만료 기능이 있는 캐싱

---

## 🏗️ 주요 아키텍처 결정

### 1. Zustand over Redux/Context

**선택 이유**:
- 간단한 API, 적은 보일러플레이트
- 더 나은 TypeScript 지원
- 고급 패턴용 미들웨어 (subscribeWithSelector)
- 글로벌 상태용 Singleton 인스턴스
- 스코프별 상태용 Factory 함수

### 2. CSS Modules over Styled Components

**선택 이유**:
- 더 나은 성능 (런타임 오버헤드 없음)
- 명확한 관심사 분리
- JS 오버헤드 없는 스코프 스타일
- SCSS modules + 글로벌 SCSS + Tailwind 혼합

### 3. Custom Modal System over Libraries

**선택 이유**:
- 모달 스택 완전 제어
- 타입 안전한 모달 props
- Focus 관리와 통합
- 부드러운 애니메이션

### 4. Electron IPC Abstraction

**선택 이유**:
- Electron API와 깔끔한 분리
- 타입 안전한 IPC 호출
- 에러 처리 표준화
- Electron 없이 테스트 가능

### 5. Profile-Based Architecture

**특징**:
- 내장된 멀티 프로필 지원
- 프로필별 격리된 API 인스턴스
- 세션 스코프 상태 관리

### 6. Feature Modules

**특징**:
- 자체 포함 feature 디렉토리
- 캡슐화된 상태, 컴포넌트, hooks
- 예시: `bootstrap`, `request-manager`, `workflow`, `rt`, `session-history`

### 7. Layout Component Primitives

**특징**:
- 재사용 가능한 레이아웃 컴포넌트 (`Row`, `Column`, `Grid`, `Flex`)
- 선언적 레이아웃 시스템
- 일관된 spacing 및 alignment

### 8. Event-Driven Architecture

**특징**:
- 컴포넌트 간 통신을 위한 커스텀 이벤트 버스
- 분리된 컴포넌트
- 타입 안전한 이벤트 페이로드
- 예시: 키보드 단축키, IPC 이벤트, UI 액션

### 9. Singleton Pattern for Services

```typescript
ProfilesAPI.getInstance()
RequestManager.getInstance()
ElectronIPCAPI.getInstance()
```

**목적**: 단일 진실 공급원 보장

### 10. Phase-Based Initialization

```
Boot → ProfileSelect → Login → Main
```

**특징**:
- 앱 생명주기의 깔끔한 분리
- 제어된 데이터 로딩

---

## 🛠️ 기술 스택

**Core**:
- React 18.3.1
- TypeScript 5.6.2
- Vite 5.4.10
- React Router 7.1.5

**State Management**:
- Zustand 5.0.3
- React Context API

**Styling**:
- SASS/SCSS 1.80.6
- CSS Modules
- Tailwind CSS 4.1.3
- classnames 2.5.1

**UI Libraries**:
- Material-UI 7.3.1
- @xyflow/react 12.8.6 (workflow diagrams)
- Monaco Editor 4.6.0 (code editor)
- react-markdown 9.0.1
- spinners-react 1.0.10

**Forms & Input**:
- rc-slider 11.1.8
- rc-tooltip 6.4.0

**Utilities**:
- i18next 24.2.1 (국제화)
- crypto-js 4.2.0
- uuid 11.1.0
- js-tiktoken 1.0.20 (토큰 카운팅)
- advanced-prompt-template-lang 0.10.4

---

## 💡 특수 패턴 & 관례

### 1. Controlled vs Instant Change

Form 컴포넌트는 debounced와 instant onChange 모두 지원:

```typescript
instantChange?: boolean
```

### 2. CommonProps Pattern

```typescript
interface CommonProps {
    className?: string;
    style?: React.CSSProperties;
}
```

### 3. Disappear Animation Pattern

```typescript
disappear?: boolean
```

모달 및 다이얼로그에서 exit 애니메이션 지원

### 4. Focus Management

- `react-focus-lock`으로 모달 focus 트래핑
- 스택형 모달용 `isFocused` prop

### 5. Hotkey System

```typescript
useHotkey({
    'Escape': (e) => {
        if (onEscapeAction) {
            onEscapeAction();
            return true; // handled
        }
    }
}, enabled, [dependencies]);
```

### 6. API Method Chaining

```typescript
ProfilesAPI.profile(profileId).session(sessionId).inputFiles.add(...)
```

### 7. Request Token Pattern

```typescript
async request(token: string, profileId: string, sessionId: string)
```

요청 추적용 고유 토큰

### 8. Channel-Based Communication

```typescript
import { Channel } from '@hve/channel';

request_ready: Channel<unknown>
```

비동기 IPC용 `@hve/channel` 사용

---

## 💡 개발자 가이드

### 네이밍 체크리스트

- [ ] 컴포넌트: `PascalCase`
- [ ] Hooks: `camelCase` (`use` 접두사)
- [ ] Stores: `camelCase` (`use` 접두사 + `Store` 접미사)
- [ ] Props 인터페이스: `{Component}Props`
- [ ] 스타일: `.module.scss`
- [ ] 파일: 컴포넌트는 `PascalCase.tsx`, 유틸리티는 `camelCase.ts`

### 컴포넌트 작성 가이드

```typescript
// 1. Props 인터페이스 정의
interface MyComponentProps extends CommonProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

// 2. 함수형 컴포넌트 + 기본값
function MyComponent({
    value,
    onChange,
    disabled = false,
    className = '',
    style = {},
}: MyComponentProps) {
    // 3. Hooks (조건부 아님!)
    const [state, setState] = useState('');
    useEffect(() => {
        // ...
    }, []);

    // 4. JSX 반환
    return (
        <div className={classNames(styles.container, className)} style={style}>
            {/* ... */}
        </div>
    );
}

export default MyComponent;
```

### Store 작성 가이드

```typescript
// 1. State 인터페이스 정의
interface MyStoreState {
    data: string;
    loading: boolean;
    update: (data: string) => void;
    fetch: () => Promise<void>;
}

// 2. Store 생성
const useMyStore = create<MyStoreState>((set, get) => ({
    data: '',
    loading: false,

    update: (data) => set({ data }),

    fetch: async () => {
        set({ loading: true });
        try {
            const result = await api.fetch();
            set({ data: result, loading: false });
        } catch (error) {
            set({ loading: false });
        }
    },
}));

export default useMyStore;
```

### Best Practices

1. ✅ 모든 컴포넌트는 함수형 + hooks
2. ✅ Props destructuring에 기본값
3. ✅ CSS Modules로 스타일 스코핑
4. ✅ `classNames` 라이브러리로 조건부 클래스
5. ✅ Zustand로 글로벌 상태
6. ✅ Context로 스코프 상태
7. ✅ IPC는 API 레이어 통과
8. ✅ 커스텀 hooks로 로직 재사용
9. ✅ 모달은 `useModal` hook으로 관리
10. ✅ 이벤트는 `useEvent` hook으로 구독

---

## 📊 통계

- **TypeScript 파일**: 566개
- **컴포넌트 디렉토리**: 28개
- **Feature 모듈**: 12개
- **모달 타입**: 14개
- **페이지**: 4개 주요 페이지

---

## ✨ 핵심 특징

이 코드베이스는 다음을 보여줍니다:

✅ **모던 React 패턴** - 함수형 컴포넌트, hooks, context
✅ **정교한 상태 관리** - 고급 패턴의 Zustand
✅ **깔끔한 IPC 추상화** - 타입 안전한 Electron 통신
✅ **포괄적인 UI 시스템** - 재사용 가능한 컴포넌트, forms, modals
✅ **타입 안전성** - 완전한 TypeScript 커버리지
✅ **모듈식 아키텍처** - Features, 컴포넌트, hooks 명확히 분리
✅ **이벤트 기반 설계** - 분리를 위한 커스텀 이벤트 버스
✅ **다중 스타일링 접근** - CSS Modules 주, Tailwind 보조
✅ **일관된 규칙** - 네이밍, 파일 구조, 코드 패턴

이 아키텍처는 멀티 프로필 지원, 워크플로우 편집, 프롬프트 관리, 실시간 AI 상호작용을 가진 복잡한 Electron 애플리케이션을 지원합니다.

---

**마지막 업데이트**: 2025-11-09
