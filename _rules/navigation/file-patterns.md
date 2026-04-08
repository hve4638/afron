# File Location Patterns

## 패키지 공통 구조

각 패키지(core, electron, chatai-models)는 동일한 `src/` 내부 패턴을 따른다:

```
src/
├── index.ts              # 패키지 공개 API (re-export)
├── features/             # 기능 모듈 (핵심 비즈니스 로직)
│   └── {feature-name}/   # 케밥-케이스 디렉토리
│       ├── index.ts      # 기능 공개 API
│       ├── {ClassName}.ts
│       └── types.ts      # (필요 시)
├── data/                 # 정적 데이터, 상수
├── types/                # 패키지 내부 타입 정의
├── lib/                  # 외부 라이브러리 래퍼, 유틸리티 라이브러리
└── utils/                # 범용 유틸리티 함수
```

## 프론트엔드 구조 패턴 (packages/front)

```
src/
├── main.tsx              # 앱 엔트리포인트
├── App.tsx               # 루트 컴포넌트 (부팅/프로필선택/메인 페이즈)
├── pages/                # 라우트 단위 페이지
│   ├── Hub.tsx           # 라우터 허브
│   ├── {PageName}/       # 파스칼케이스 페이지 디렉토리
│   │   ├── index.ts      # re-export
│   │   ├── {PageName}.tsx
│   │   ├── {PageName}.hook.tsx  # 페이지 전용 훅
│   │   ├── hooks/        # 복수 훅
│   │   ├── layout/       # 페이지 내부 레이아웃
│   │   └── modals/       # 페이지 전용 모달
├── components/           # 재사용 가능 컴포넌트
│   ├── atoms/            # 기본 UI 원자 컴포넌트
│   │   └── {Name}/      # 각 atom은 디렉토리
│   ├── container/        # 컨테이너 컴포넌트
│   ├── layout/           # 레이아웃 컴포넌트
│   ├── model-ui/         # 도메인별 UI 컴포넌트
│   └── ui/               # 추가 UI 컴포넌트
├── features/             # 기능 모듈
│   └── {feature-name}/   # 케밥-케이스
│       ├── index.ts
│       ├── components/   # 기능 내부 컴포넌트
│       ├── context/      # 기능 전용 React Context
│       ├── hooks/        # 기능 전용 훅
│       └── models/       # 기능 전용 모델/데이터 클래스
├── stores/               # Zustand 전역 스토어
│   ├── index.ts          # 스토어 re-export
│   ├── use{Name}Store.ts # 각 스토어 파일
│   ├── types/            # 스토어 공용 타입
│   ├── utils/            # 스토어 유틸리티 (storeTool 등)
│   └── local/            # 로컬 스토어
├── modals/               # 최상위 레벨 모달 컴포넌트
│   └── {ModalName}/      # 파스칼케이스
│       ├── {ModalName}.tsx
│       └── options/      # (설정 모달 등의 옵션 패널)
├── api/                  # 백엔드 통신 계층
│   ├── local/            # Electron IPC 래퍼
│   ├── profiles/         # 프로필 API 추상화
│   ├── events/           # 이벤트 파이프
│   └── request/          # 요청 API
├── hooks/                # 범용 커스텀 훅
├── context/              # 범용 React Context
├── events/               # 이벤트 정의
├── constants/            # 상수
├── types/                # 프론트 내부 타입
├── utils/                # 범용 유틸리티
├── lib/                  # 라이브러리 래퍼
├── locales/              # i18n 번역 파일
│   ├── ko/               # 한국어
│   └── en/               # 영어
└── assets/               # 정적 리소스
    ├── style/            # SCSS 스타일시트
    └── img/              # 이미지
```

## 모델 위치

| 찾는 것 | 위치 |
|---------|------|
| 공유 타입 정의 | `packages/types/types/` |
| IPC 인터페이스 타입 | `packages/types/types/ipc/` |
| AI 모델 선언 | `packages/chatai-models/src/features/chatai-models/modelInitializer/` |
| 프로필 비즈니스 로직 | `packages/core/src/features/profiles/Profile/` |
| RT 실행 엔진 | `packages/core/src/features/rt-worker/` |
| RT 워크플로우 실행 | `packages/core/src/features/rt-worker/workflow/` |
| RT 프롬프트 생성 | `packages/core/src/features/rt-worker/prompt-generator/` |
| RT 내보내기/가져오기 | `packages/core/src/features/rt-packer/` |
| 마스터키 암호화 | `packages/core/src/features/masterkey-manager/` |
| 로거 | `packages/core/src/features/logger/` |
| IPC 핸들러 | `packages/electron/src/ipc/handlers/` |
| Electron 초기화 | `packages/electron/src/initialize/` |
| 런타임 레지스트리 | `packages/electron/src/runtime/` |
| Preload 스크립트 | `packages/electron/src/preload/` |
| Zustand 스토어 | `packages/front/src/stores/` |
| 프론트 API 계층 | `packages/front/src/api/` |
| 페이지 컴포넌트 | `packages/front/src/pages/` |
| 모달 컴포넌트 | `packages/front/src/modals/` |
| 원자 컴포넌트 | `packages/front/src/components/atoms/` |
| 워크플로우 에디터 | `packages/front/src/features/workflow/` |
| 부트스트랩 로직 | `packages/front/src/features/bootstrap/` |

## 테스트 파일 위치

테스트 파일은 소스 파일과 동일 디렉토리에 `{Name}.test.ts` 패턴으로 배치된다 (co-located tests).

현재 존재하는 테스트:
- `packages/core/src/features/acstorage-accessor/HistoryAccessor/HistoryAccessor.test.ts`
- `packages/core/src/features/acstorage-accessor/HistoryAccessor/HistoryDAO.test.ts`
- `packages/core/src/features/chatai-fetcher/ChatAIFetcher.test.ts`
- `packages/core/src/features/profiles/Profile/Profile.test.ts`
- `packages/core/src/features/profiles/Profile/rt/RTControl.test.ts`
- `packages/core/src/lib/crypt-wrapper/AES.test.ts`
- `packages/core/src/lib/crypt-wrapper/learn.test.ts`
- `packages/core/src/utils/date.test.ts`

테스트는 core 패키지에만 존재하며, vitest로 실행된다. 프론트엔드에는 테스트가 없다.

## 설정 파일

| 파일 | 위치 | 용도 |
|------|------|------|
| `tsconfig.json` | 각 패키지 루트 | TypeScript 설정 (경로 별칭 `@/` -> `src/`) |
| `rollup.config.js` | core, chatai-models, electron, locale | Rollup 번들링 |
| `vite.config.ts` | front, core, locale | Vite 빌드/개발서버 |
| `jest.config.ts` | 루트, front, core, electron | Jest 테스트 설정 |
| `eslint.config.js` | front | ESLint 린트 |
| `forge.config.js` | electron | Electron Forge 설정 |
| `.env` | electron | 환경 변수 (dev URL, 옵션) |
| `.env.development` | front | 개발 환경 변수 |

## Import 경로 규칙

- 패키지 내부: `@/` 별칭 사용 (tsconfig paths로 `src/`에 매핑)
  - 예: `import runtime from '@/runtime'`
  - 예: `import { throttle } from '@/utils'`
- 패키지 간: npm 패키지명 사용
  - 예: `import { IPCInvokerInterface } from '@afron/types'`
  - 예: `import { RTPacker, NoLogger } from '@afron/core'`
- 프론트엔드 내부: 일부 모듈은 별칭 없이 상대 경로 또는 짧은 이름 사용
  - 예: `import { IPCError } from 'api/error'`
  - 예: `import ProfilesAPI from 'api/profiles'`
  - 예: `import 'assets/style/index.scss'`
