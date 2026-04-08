# Afron Convention Overview

> 이 문서는 afron 코드베이스의 코딩 컨벤션을 요약한다.
> 새로운 코드를 작성할 때 기존 패턴과 일관성을 유지하기 위해 참고한다.

## 문서 목록

| 파일 | 내용 |
|------|------|
| [naming.md](./naming.md) | 파일, 변수, 함수, 클래스, 상수, import alias 네이밍 규칙 |
| [error-handling.md](./error-handling.md) | 에러 클래스 구조, IPC Result Tuple, 비동기 에러 처리, 로깅 |
| [internal-api.md](./internal-api.md) | export 패턴, public/private 구분, IPC API 구조, DI 패턴 |
| [code-organization.md](./code-organization.md) | import 순서, 클래스/컴포넌트/Store 파일 구조, 주석 스타일 |
| [testing.md](./testing.md) | 테스트 파일명, vitest 패턴, assertion 스타일, mock 전략 |

---

## 핵심 원칙 요약

### 1. TypeScript 설정
- `strict: true`, `noImplicitAny: false` (암시적 any 허용)
- `noImplicitOverride: true` (override keyword 필수)
- `allowUnreachableCode: true` (switch fallthrough 등 허용)
- `noPropertyAccessFromIndexSignature: true` (bracket notation 강제)
- enum 사용하지 않음 -> `const object + type alias` 패턴

### 2. 언어/주석
- 주석은 **한국어** 사용 (코드 내 설명, TODO, 타입 설명 등)
- 식별자/코드는 **영어** 사용
- JSDoc은 드물게 사용, 인라인 주석(`//`, `/* */`) 위주

### 3. 접근 제어
- 클래스 private: ES Private Fields (`#`) 선호
- Protected: `protected` keyword
- Singleton: `private constructor` + `static instance` / `static getInstance()`
- Factory: `static async From(...)` 패턴

### 4. 비동기
- `async/await` 전면 사용
- Promise chain은 RTWorker의 fire-and-forget 패턴에서만 사용
- callback은 사용하지 않음

### 5. 에러 처리
- IPC 경계: Result Tuple `[error, data?]`
- 내부 로직: throw/catch + 커스텀 에러 클래스
- 로깅: 선택적 LevelLogger 주입 (NoLogger null object 패턴)

### 6. React 패턴
- 상태관리: **Zustand** (`create` + `subscribeWithSelector`)
- 이벤트 시스템: 자체 Zustand 기반 event store
- 조건 렌더링: `&&` 연산자
- 복잡한 hook은 `.hook.tsx` / `.hooks.ts`로 분리
- CSS Modules (SCSS): `{Component}.module.scss`

### 7. 테스트
- **Vitest** 프레임워크
- 소스 옆 co-located (`{File}.test.ts`)
- in-memory 대체 객체 (MemACStorage, MockMasterKeyManager)
- 한국어 테스트 시나리오 설명 허용

---

## 패키지별 특성

| 패키지 | 역할 | 특이 패턴 |
|--------|------|-----------|
| `@afron/types` | 공유 타입 정의 | `.d.ts` 파일, namespace 사용 |
| `@afron/core` | 비즈니스 로직 | abstract class, factory pattern, logger DI |
| `electron` | Electron main process | IPC handler, runtime registry, Result Tuple |
| `front` | React renderer | Zustand, ProfileEvent facade, hook 분리 |
| `@afron/chatai-models` | AI 모델 메타데이터 | Builder pattern, provider initializer |
| `locale` | 다국어 리소스 | i18n resources |
