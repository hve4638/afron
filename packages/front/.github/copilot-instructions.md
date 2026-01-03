# Frontend Coding Guidelines

## Import & Path Alias

- `@/` alias 사용 (예: `@/components/atoms/Button`)
- 같은 도메인(폴더) 내에서는 상대경로 사용 (예: `../types.ts`)

## 문자열

- 큰따옴표(") 대신 작은따옴표(') 사용

## 스타일링

- 컴포넌트 스타일: `컴포넌트명.module.scss` 생성 후 import
- 스타일 관련 참고: `@/assets/style/`

## 컴포넌트 사용

- 네이티브 `<button>`, `<input>` 대신 커스텀 컴포넌트 사용
  - Button: `@/components/atoms/Button`
  - CheckBox: `@/components/atoms/CheckBox`
  - Dropdown: `@/components/atoms/Dropdown`
  - Slider: `@/components/atoms/Slider`
- 레이아웃: `@/components/layout` (Row, Column, Grid, Flex, Center, Gap)
- 조건부 클래스: `classnames` 라이브러리 사용

## 디렉토리 구조

```
src/
├── components/       # 공용 컴포넌트
│   ├── atoms/       # 원자 컴포넌트 (Button, CheckBox 등)
│   ├── layout/      # 레이아웃 컴포넌트
│   └── container/   # 컨테이너 컴포넌트
├── features/        # 독립적 기능 단위 (modal, workflow 등)
├── hooks/           # 공용 훅
├── stores/          # Zustand 스토어
├── modals/          # 모달 컴포넌트
├── pages/           # 페이지 컴포넌트
├── context/         # React Context
├── types/           # 공용 타입 정의
├── lib/             # 라이브러리/유틸리티
├── api/             # API 레이어
└── constants/       # 상수 정의
```

## 컴포넌트 파일 구조

```
ComponentName/
├── index.ts              # export 및 스타일 import
├── ComponentName.tsx     # 메인 컴포넌트
├── ComponentName.module.scss  # 스타일
├── types.ts              # 타입 (필요시)
└── utils.ts              # 유틸 (필요시)
```

## 페이지 구조

```
PageName/
├── index.ts         # export
├── PageName.tsx     # 메인 페이지
├── layout/          # 페이지 내부 레이아웃
└── hooks/           # 페이지 전용 훅
```

## 모달 시스템

- 모달 컴포넌트: `@/features/modal` (Modal, ModalProvider, useModal, useModalInstance)
- Dialog 패턴: `@/modals/Dialog` (ConfirmDialog, InfoDialog 등)
- 사용법 참고: `@/modals/SettingModal/`

## 타입 정의

- 공용 타입: `@/types/`
- 컴포넌트별 타입: 해당 폴더 내 `types.ts`
- React 컴포넌트 Props 타입 참고: `@/types/common-props.ts`, `@/types/react-node-props.ts`

## 훅 (Hooks)

- 공용 훅: `@/hooks/`
- 도메인 전용 훅: 해당 폴더 내 `hooks/`
- 훅 파일명: `useXxx.ts`

# 출력 가이드

최종 응답시 한글로 답변할 것