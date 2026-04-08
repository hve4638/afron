# Directory Layout

Afron은 Yarn Workspaces 기반의 모노레포 구조를 가진 Electron + React 데스크탑 애플리케이션이다.
AI 모델(ChatGPT, Claude, Gemini 등)과 대화하기 위한 프론트엔드 클라이언트이다.

## 최상위 구조

```
afron/
├── package.json          # Yarn Workspaces 루트 (private: true)
├── jest.config.ts        # 루트 Jest 설정
├── yarn.lock
├── scripts/              # PowerShell 빌드/클린 스크립트
├── _img/                 # README용 이미지
└── packages/             # 모든 워크스페이스 패키지
    ├── types/            # @afron/types - 공유 타입 정의
    ├── chatai-models/    # @afron/chatai-models - AI 모델 선언/초기화
    ├── core/             # @afron/core - 핵심 비즈니스 로직
    ├── locale/           # @afron/locale - 다국어 지원 (빌드용, 소스 없음)
    ├── electron/         # @afron/electron - Electron 메인 프로세스
    └── front/            # @afron/frontend - React 렌더러 프로세스
```

## 패키지별 역할

### `@afron/types` (packages/types)
- 모든 패키지가 공유하는 TypeScript 타입 정의 전용 패키지
- `.d.ts` 파일만 존재하며 런타임 코드 없음 (index.js는 빈 파일)
- 주요 타입 카테고리:
  - `rt/` - RT(Request Template) 관련 타입
  - `rt-var/` - RT 변수 시스템 타입
  - `chatai/` - AI 모델 설정 타입
  - `event-pipe/` - 이벤트 파이프 타입
  - `storage-schema/` - 저장소 스키마 (Profile, RT, Session)
  - `ipc/` - IPC 통신 인터페이스 정의
  - `utils/` - 유틸리티 타입

### `@afron/chatai-models` (packages/chatai-models)
- AI 모델 목록 선언 및 초기화 로직
- 구조:
  - `src/features/chatai-models/` - 모델 선언, 초기화기(OpenAI, Claude, Gemini, VertexAI, Debug)
  - `src/features/model-builder/` - 모델 목록 빌더 (CategoryBuilder, GroupBuilder, ModelListBuilder)
  - `src/data/` - 정적 데이터

### `@afron/core` (packages/core)
- Electron/프론트엔드에 무관한 핵심 비즈니스 로직
- 구조:
  - `src/features/logger/` - 파일 기반 로거 (AfronLogger)
  - `src/features/nologger/` - NoOp 로거
  - `src/features/profiles/` - 프로필 관리 (Profile, ProfileControl, ProfileSession, RT 관리)
  - `src/features/rt-worker/` - RT 실행 엔진 (워크플로우, 프롬프트 생성, ChatAI 노드)
  - `src/features/rt-packer/` - RT 내보내기/가져오기 (zip 기반)
  - `src/features/rt-template-factory/` - RT 템플릿 생성
  - `src/features/chatai-fetcher/` - AI API 호출 로직
  - `src/features/masterkey-manager/` - 마스터키 관리 (암호화)
  - `src/features/event-emitter/` - 글로벌 이벤트 발행
  - `src/features/app-version-manager/` - 앱 버전 관리
  - `src/features/acstorage-accessor/` - ac-storage 접근자 (History, Secret)
  - `src/features/model-metadata-resolver/` - 모델 설정 해석
  - `src/lib/` - 유틸리티 라이브러리 (crypt-wrapper, uuid, zipper, unzipper, istext)
  - `src/utils/` - 범용 유틸리티 (date 등)
  - `src/types/` - core 내부 타입
  - `src/data/` - 저장소 트리 구조 정의

### `@afron/electron` (packages/electron)
- Electron 메인 프로세스 (Node.js 환경)
- 구조:
  - `src/main.ts` - 엔트리포인트
  - `src/features/elctron-app/` - BrowserWindow 생성, 앱 라이프사이클 관리
  - `src/initialize/` - 앱 초기화 파이프라인 (경로, 환경변수, 레지스트리, IPC, 개발옵션)
  - `src/runtime/` - 런타임 레지스트리 (싱글턴 서비스 컨테이너)
  - `src/ipc/` - IPC 핸들러 등록 및 구현
    - `handlers/` - 카테고리별 IPC 핸들러 (general, profiles, profileRT, request 등)
  - `src/preload/` - contextBridge를 통한 IPC API 노출
  - `src/features/event-process/` - RT 내보내기/가져오기 프로세스
  - `src/features/migration-service/` - 레거시 데이터 마이그레이션
  - `src/features/program-path/` - 프로그램 경로 관리
  - `src/features/throttle-action/` - 쓰로틀 액션
  - `src/features/unique-store/` - 고유 저장소
  - `src/data/` - 상수 데이터
  - `src/types/` - electron 내부 타입
  - `src/utils/` - 유틸리티

### `@afron/frontend` (packages/front)
- React 렌더러 프로세스 (Vite + React 19)
- 구조:
  - `src/main.tsx` - 엔트리포인트
  - `src/App.tsx` - 앱 루트 (부팅 -> 프로필 선택 -> 메인 페이즈)
  - `src/pages/` - 페이지 컴포넌트
    - `Hub.tsx` - HashRouter 기반 라우팅 허브
    - `Home/` - 메인 홈 페이지 (IO 섹션, 세션 탭, 헤더)
    - `ProfileSelect/` - 프로필 선택 페이지
    - `PromptEditor/` - 프롬프트 편집기 페이지
    - `WorkflowEditor/` - 워크플로우 편집기 (XYFlow 기반)
    - `Startup/` - 시작 페이지 (마스터키 초기화 등)
    - `RTTreeModal/` - RT 트리 모달
    - `Test/` - 테스트/디버그 페이지
  - `src/stores/` - Zustand 전역 상태 스토어
  - `src/api/` - 백엔드 통신 계층
    - `local/` - Electron IPC API 래퍼
    - `profiles/` - 프로필/세션/RT API 래퍼
    - `events/` - 이벤트 파이프 (RequestEventPipe, GlobalEventPipe)
    - `request/` - 요청 API
  - `src/components/` - 재사용 가능 컴포넌트
    - `atoms/` - 기본 UI 요소 (Button, Dropdown, Slider, Checkbox 등)
    - `container/` - 컨테이너 컴포넌트 (InfiniteScroll, ListView)
    - `layout/` - 레이아웃 컴포넌트
    - `model-ui/` - 모델 관련 UI (SafetyFilter, Verbosity, ReasoningEffort)
    - `ui/` - 추가 UI 컴포넌트
    - 기타: FormFields, MarkdownArea, TreeView, TabBar, ToastAnchor 등
  - `src/features/` - 기능 모듈
    - `bootstrap/` - 앱 부트스트래핑
    - `modal/` - 모달 시스템 (ModalProvider, ModalContext)
    - `modals/` - 개별 모달 컴포넌트
    - `profile-event/` - 프로필 이벤트 핸들링
    - `request-manager/` - 요청 관리
    - `rt/` - RT 모델
    - `rtTreeView/` - RT 트리뷰
    - `session-history/` - 세션 히스토리
    - `workflow/` - 워크플로우 UI (노드, 패널, 컨텍스트)
    - `monaco-prompt-template-language/` - Monaco 에디터 커스텀 언어
    - `event-pipe-handler/` - 이벤트 파이프 핸들러
    - `loading/` - 로딩 상태
  - `src/modals/` - 최상위 모달 컴포넌트들
    - Dialog, ErrorLogModal, FormModal, HistoryModal, InfoModal
    - ModelConfigModal, NewRTModal, ProgressModal, RTEditModal
    - RTExportModal, RequestPreviewModal, SettingModal
  - `src/hooks/` - 커스텀 React 훅
  - `src/context/` - React Context (RTContext)
  - `src/events/` - 이벤트 정의
  - `src/constants/` - 상수
  - `src/types/` - 프론트엔드 내부 타입
  - `src/utils/` - 유틸리티
  - `src/lib/` - 라이브러리 래퍼 (xyflow, zustbus)
  - `src/locales/` - i18n 번역 파일 (ko, en)
  - `src/assets/` - 스타일시트 (SCSS, Tailwind), 이미지

### `@afron/locale` (packages/locale)
- 다국어 지원 패키지
- 빌드 설정만 존재 (rollup, vite, tsconfig)
- core와 거의 동일한 의존성을 가짐 (레거시 또는 미사용 가능성)
