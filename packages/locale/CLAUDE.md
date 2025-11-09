# @afron/locale - Code Conventions & Architecture

## 📦 패키지 개요

**목적**: 다국어 지원 (i18n) 기능

**현재 상태**: ⚠️ **아직 구현되지 않음**

이 패키지는 설정 파일만 존재하며, 실제 소스 코드는 아직 작성되지 않았습니다.

---

## 📁 디렉토리 구조

```
packages/locale/
├── package.json
├── tsconfig.json
├── rollup.config.js
└── vite.config.ts
```

**현재 상태**: 소스 코드 없음 (`src/` 디렉토리 없음)

---

## 🔧 빌드 설정

### 패키지 설정

```json
{
  "name": "@afron/locale",
  "version": "1.0.0",
  "main": "./dist/bundle.cjs",
  "module": "./dist/bundle.mjs",
  "types": "./dist/index.d.ts",
  "type": "module"
}
```

### TypeScript 설정

- **Target**: ES2022 (예상)
- **Strict mode**: 활성화 (예상)
- **Module system**: ESM

### 빌드 도구

- **Rollup**: 번들링 (설정됨)
- **Vite**: 추가 빌드 도구 (설정됨)
- **Vitest**: 테스트 프레임워크 (설정됨)

---

## 💡 향후 개발 방향 (예상)

### 예상되는 기능

1. **다국어 리소스 관리**
   - 번역 파일 로딩
   - 언어별 리소스 번들

2. **i18n 유틸리티**
   - 텍스트 번역 함수
   - 날짜/시간 포맷팅
   - 숫자 포맷팅

3. **언어 감지**
   - 시스템 언어 감지
   - 사용자 선호 언어 관리

### 권장 구조 (미래)

```
packages/locale/
├── src/
│   ├── features/
│   │   ├── i18n/           # i18n 핵심 기능
│   │   ├── formatters/     # 포맷터
│   │   └── loaders/        # 리소스 로더
│   ├── locales/            # 번역 리소스
│   │   ├── ko/            # 한국어
│   │   ├── en/            # 영어
│   │   └── ja/            # 일본어
│   └── index.ts
```

### 권장 컨벤션 (미래)

다른 패키지들과의 일관성을 위해:

- **파일 네이밍**: `kebab-case.ts` (유틸리티), `PascalCase.ts` (클래스)
- **클래스**: `PascalCase`
- **함수**: `camelCase`
- **Private 필드**: `#camelCase`
- **Export**: Barrel exports via `index.ts`
- **테스트**: `*.test.ts` 파일 동일 위치

---

## 📝 노트

이 패키지는 현재 placeholder로 존재하며, 향후 다국어 지원 기능이 필요할 때 구현될 예정입니다.

`package.json`의 의존성이 `@afron/core`와 동일한 것으로 보아, core 패키지를 복사하여 생성된 것으로 추정됩니다. 실제 구현 시 불필요한 의존성은 제거해야 합니다.

---

**마지막 업데이트**: 2025-11-09
**상태**: 미구현
