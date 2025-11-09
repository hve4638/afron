# @afron/types - Code Conventions & Architecture

## 📦 패키지 개요

**목적**: Afron 프로젝트 전반에서 사용되는 공통 TypeScript 타입 정의

**역할**:
- 전체 모노레포에서 공유되는 타입 시스템
- IPC (Inter-Process Communication) 타입 정의
- ChatAI 모델 및 설정 타입
- Runtime Template (RT) 관련 타입
- 이벤트 파이프라인 타입

**기술 스택**:
- TypeScript 타입 정의 (`.d.ts`)
- 일부 구현 코드 (`.ts`)

**의존성**: 없음 (프로젝트의 최하위 계층)

---

## 📁 디렉토리 구조

```
packages/types/
├── package.json
├── index.js                    # 메인 진입점
├── types.d.ts                  # 루트 타입 정의
└── types/                      # 모든 TypeScript 타입 정의
    ├── index.d.ts              # 메인 export 집합소
    ├── chatai/                 # ChatAI 관련 타입
    │   ├── index.d.ts
    │   ├── chatai-model.d.ts
    │   ├── thinking-efforts.d.ts
    │   └── gemini-safety-setting.d.ts
    ├── event-pipe/             # 이벤트 파이프라인 타입
    │   ├── index.d.ts
    │   └── global-event.d.ts
    ├── ipc/                    # IPC 통신 타입
    │   ├── index.ts
    │   ├── interface.d.ts
    │   ├── invokers.d.ts
    │   ├── listeners.d.ts
    │   ├── data.ts
    │   ├── result.d.ts
    │   └── declared.d.ts
    ├── rt/                     # Request Template 타입
    │   ├── index.d.ts
    │   ├── rt.d.ts
    │   ├── flow.d.ts
    │   ├── form.d.ts
    │   └── event.d.ts
    ├── rt-var/                 # Runtime 변수 타입
    │   ├── index.ts
    │   ├── rt-var.ts
    │   ├── rt-var-create.ts
    │   ├── rt-var-update.ts
    │   ├── rt-var-stored.ts
    │   └── var-data.d.ts
    ├── storage-struct/         # 스토리지 구조 정의
    │   └── index.d.ts
    └── utils/                  # 유틸리티 타입
        └── index.ts
```

**조직화 전략**: Feature-based modules (기능별 모듈화)

---

## 📝 코드 컨벤션

### 1. 파일 네이밍

**규칙: `kebab-case` (소문자 + 하이픈)**

예시:
- `chatai-model.d.ts`
- `thinking-efforts.d.ts`
- `gemini-safety-setting.d.ts`
- `rt-var-create.ts`
- `global-event.d.ts`

**특수 케이스**:
- `index.ts` / `index.d.ts` - 디렉토리 export 집합소
- 주로 `.d.ts` 확장자 사용 (타입 전용)
- 구현이 필요한 경우에만 `.ts` 사용

### 2. 타입 네이밍

**규칙: `PascalCase`**

#### 접두사 (Prefix) 패턴

- `RT*` - Runtime/Request Template 관련
  - `RTMode`, `RTInput`, `RTForm`, `RTMetadata`
- `IPC*` - Inter-Process Communication
  - `IPCInvokerName`, `IPCInterface`, `IPCInvokerGeneral`
- `ChatAI*` - AI 모델 관련
  - `ChatAIModel`, `ChatAIConfig`, `ChatAIFlags`
- `E*` - Error/Result 타입
  - `EError`, `EResult`, `ENoResult`
- `Base*` - 기본/베이스 타입
  - `BaseRTVar`, `BaseRTForm`, `BasePromptVar`

#### 접미사 (Suffix) 패턴

- `*Data` - 데이터 구조
  - `RTFlowData`, `RTEventData`, `GlobalEventData`
- `*Metadata` - 메타데이터
  - `RTMetadata`, `HistoryMetadata`, `RTPromptMetadata`
- `*Config` - 설정 타입
  - `ChatAIConfig`, `ModelConfiguration`
- `*Flags` - 플래그 모음
  - `ChatAIFlags`
- `*Create` - 생성용 타입
  - `RTVarCreate`, `CustomModelCreate`
- `*Update` - 업데이트용 타입
  - `RTVarUpdate`
- `*Stored` - 저장소 표현
  - `RTVarStored`
- `*Naive` - 전처리 전/단순 버전
  - `RTVarDataNaive`, `RTFormNaive`
- `*Interface` - 인터페이스 정의
  - `IPCInvokerInterface`, `IPCListenerInterface`

### 3. 타입 정의 패턴

#### Type Alias (가장 흔함)

```typescript
export type RTMode = 'prompt_only' | 'flow';
export type SupportedVerbosity = 'low' | 'medium' | 'high';
export type EError = { name: string, message: string, [key: string]: any };
```

#### Interface

```typescript
export interface IPCInvokerGeneral { ... }
export interface CustomModel { ... }
```

#### Namespace (관련 타입 그룹화)

```typescript
export declare namespace RTFlowNodeOptions { ... }
export declare namespace IPCInvokers { ... }
export declare namespace ProfileStorage { ... }
export declare namespace GeminiSafetySetting { ... }
export declare namespace RTVarConfig { ... }
```

#### Enum (상수용)

```typescript
export enum IPCInvokerName { ... }
export enum IPCListenerName { ... }
```

#### Union Types (Discriminated Unions 광범위 사용)

```typescript
export type RTVar = (
    RTVarExternal
    | RTVarConstant
    | RTVarForm
    | RTVarUnknown
);
```

#### Intersection Types (타입 결합)

```typescript
export type GlobalEventData = {
    id: string;
} & GlobalEventDataWithoutId;
```

---

## 🏗️ 아키텍처 패턴

### 1. Barrel Export Pattern (재-export 패턴)

각 디렉토리의 `index` 파일이 하위 모듈을 모두 재-export:

```typescript
// types/index.d.ts
export * from './rt';
export * from './rt-var';
export * from './chatai';
export * from './event-pipe';
export * from './storage-struct';
export * from './ipc';
export * from './utils';
```

```typescript
// types/chatai/index.d.ts
export * from './chatai-model';
export * from './thinking-efforts';
export * from './gemini-safety-setting';
```

### 2. Discriminated Unions (판별 유니온)

`type` 필드를 사용한 타입 구분:

```typescript
type RTEventDataError = {
    type: 'error'
    detail: string[];
} & (
    { reason_id: 'no_result' | ... }
    | { reason_id: 'http_error'; http_status: number; }
    | { reason_id: 'env_error'; title: string; }
)
```

### 3. WithoutId Pattern

ID 없는 타입을 먼저 정의한 후 ID와 결합:

```typescript
export type GlobalEventDataWithoutId = (...)
export type GlobalEventData = {
    id: string;
} & GlobalEventDataWithoutId;
```

### 4. Result Type Pattern (Go-style Error Handling)

에러 우선 튜플 패턴:

```typescript
export type EResult<T> = Promise<readonly [EError] | readonly [null, T]>;
export type ENoResult = Promise<readonly [EError | null]>;
```

### 5. Pick/Omit Utility Types

필요한 필드만 선택하거나 제외:

```typescript
export type RTPromptMetadata = Pick<ProfileStorage.RT.Prompt,
    'id' | 'name' | 'variables' | 'model'
>
export type CustomModelCreate = Omit<CustomModel, 'id'> & { id?: string };
```

### 6. Optional Type Helper

```typescript
export type Optional<T> = T | undefined | null;
```

### 7. Configuration Objects Pattern

중첩 객체로 복잡한 설정 표현, 관련 필드만 채움:

```typescript
config: {
    text?: RTVarConfig.Text;
    number?: RTVarConfig.Number;
    // 관련 필드만 채워짐
}
```

---

## 🎯 주요 기능 영역

### 1. IPC (Inter-Process Communication)
- Electron 메인/렌더러 프로세스 간 통신 타입
- Invoker/Listener 패턴
- 타입 안전한 IPC 인터페이스

### 2. ChatAI Models
- AI 모델 설정 및 구성
- 모델별 특화 옵션 (Gemini Safety Settings, Thinking Efforts 등)

### 3. Request Templates (RT)
- 프롬프트 템플릿 시스템
- 두 가지 모드: `prompt_only`, `flow`
- 변수, 폼, 메타데이터 관리

### 4. Runtime Variables (RT-Var)
- 템플릿에서 사용되는 동적 변수
- Create/Update/Stored 상태 관리
- 다양한 변수 타입 (Form, Constant, External 등)

### 5. Event Pipeline
- 전역 이벤트 시스템
- 타입 안전한 이벤트 데이터

### 6. Storage Structures
- 프로필, 세션, RT 등의 저장소 구조

---

## 📚 문서화 규칙

### JSDoc 스타일 (일관성 없음)

```typescript
/** RT 트리 구조 */
export type RTMetadataTree = ...

/**
 * 프롬프트 추가
 * @return 갱신된 프롬프트 순서 정보
 */
addPrompt(...): ...

/**
 * backend -> frontend 넘겨주는 RTVar 타입 정의
 */
export type RTVar = ...
```

**문서화 특징**:
- 한글/영어 혼용
- JSDoc 사용하지만 일관성 없음
- `@deprecated` 태그 사용
- 대부분 타입명으로 자체 문서화 (self-documenting)

---

## 🔑 핵심 아키텍처 결정 사항

1. **Named Exports만 사용** - Default export 없음
2. **Namespace로 논리적 그룹화** - 관련 타입을 namespace로 묶음
3. **타입 전용 파일 우선** - 주로 `.d.ts`, 필요시에만 `.ts`
4. **Feature-based Organization** - 타입별이 아닌 기능별 조직화
5. **Readonly Tuples** - Result 타입에 `readonly [...]` 사용
6. **String Literal Unions 선호** - Enum보다 문자열 리터럴 유니온 (IPC 제외)
7. **최소한의 Global Augmentation** - 특정 파일에서만 사용

---

## 💡 개발 가이드

### Import 예시

```typescript
// 특정 타입 import
import { RTMode, RTMetadata, ChatAIModel } from '@afron/types';

// 네임스페이스 import
import { IPCInvokers, RTVarConfig } from '@afron/types';
```

### Export 규칙

- 모든 export는 named export
- 각 파일 끝에 `export { };` 추가 (모듈 컨텍스트 보장)
- index 파일을 통한 재-export

### 새 타입 추가 시

1. 적절한 기능 디렉토리에 `kebab-case.d.ts` 파일 생성
2. `PascalCase`로 타입 정의
3. 해당 디렉토리의 `index.d.ts`에 재-export 추가
4. 필요시 JSDoc 주석 추가

---

**마지막 업데이트**: 2025-11-09
