# @afron/chatai-models - Code Conventions & Architecture

## 📦 패키지 개요

**목적**: ChatAI 모델 선언 및 메타데이터 관리

**역할**:
- AI 모델 카테고리/그룹/개별 모델 정의
- 모델별 설정 및 기능 플래그 관리
- 프로바이더별 모델 초기화 (OpenAI, Claude, Gemini, VertexAI 등)
- 모델 레지스트리 제공

**기술 스택**:
- TypeScript
- Rollup (빌드)
- ES2022 Private Class Fields

**의존성**:
- `@afron/types` (타입 정의)

---

## 📁 디렉토리 구조

```
packages/chatai-models/
├── package.json                    # 패키지 설정
├── tsconfig.json                   # TypeScript 설정
├── rollup.config.js               # 빌드 설정
└── src/
    ├── index.ts                   # 메인 진입점
    ├── data/
    │   └── index.ts              # 공유 데이터/설정 export
    └── features/
        ├── chatai-models/        # 모델 선언 기능
        │   ├── index.ts
        │   ├── ModelDeclaration.ts
        │   └── modelInitializer/
        │       ├── index.ts
        │       ├── claude.ts
        │       ├── openAI.ts
        │       ├── gemini.ts
        │       ├── vertexAI.ts
        │       └── debug.ts
        └── model-builder/        # Builder 패턴 구현
            ├── index.ts
            ├── ModelListBuilder.ts
            ├── CategoryBuilder.ts
            ├── GroupBuilder.ts
            └── data.ts
```

**조직화 원칙**:
- Feature-based organization (기능별)
- 최대 3단계 깊이
- Builder와 Declaration 명확히 분리
- 공유 데이터는 `data/` 디렉토리

---

## 📝 코드 컨벤션

### 1. 파일 네이밍

| 파일 타입 | 규칙 | 예시 |
|----------|------|------|
| 클래스 파일 | `PascalCase.ts` | `ModelListBuilder.ts`, `CategoryBuilder.ts` |
| 유틸리티/데이터 | `camelCase.ts` | `data.ts`, `debug.ts` |
| 프로바이더 초기화 | `camelCase.ts` | `claude.ts`, `openAI.ts`, `gemini.ts` |
| Index 파일 | `index.ts` | 모든 barrel export 파일 |

**규칙**:
- 클래스 파일명은 클래스명과 정확히 일치
- 프로바이더 파일은 프로바이더명을 camelCase로
- 모든 TypeScript 파일은 `.ts` 확장자

### 2. 클래스 & 함수 네이밍

#### 클래스: `PascalCase`

```typescript
class ModelListBuilder
class CategoryBuilder
class GroupBuilder
class ModelDeclaration
```

#### 함수: `camelCase`

```typescript
function initProvider(builder: CategoryBuilder)
export default initOpenAIModel
export default initClaudeModel
```

#### 메서드: `camelCase`

```typescript
category()       // Public 메서드
group()          // Public 메서드
model()          // Public 메서드
build()          // Public 메서드
```

#### Private 필드 & 메서드: `#camelCase` (ES2022 Private Fields)

```typescript
#categories      // Private 필드
#builder        // Private 필드
#map            // Private 필드
#load()         // Private 메서드
#parseMap()     // Private 메서드
```

#### 변수 & 상수

```typescript
// camelCase for variables
const categoryBuilder = new CategoryBuilder();
const modelDeclaration = ModelDeclaration.getInstance();

// SCREAMING_SNAKE_CASE for constants
const DEFAULT_CHATAI_CONFIG = { ... }

// camelCase for config objects
const configFlags = { ... }
const flags = { ... }
```

---

## 🏗️ 디자인 패턴

### 1. Builder Pattern (주요 패턴)

**3단계 Builder 계층 구조**:

```
ModelListBuilder (최상위)
  └─ CategoryBuilder (중간)
      └─ GroupBuilder (하위)
```

**Fluent Interface (메서드 체이닝)**:

```typescript
builder
    .category('openai', 'OpenAI', (c) => initOpenAIModel(c))
    .category('google', 'Gemini', (c) => initGeminiModel(c))
    .category('anthropic', 'Anthropic', (c) => initClaudeModel(c))

// Category 내부:
builder.group('GPT-5', config, flags)
    .model('gpt-5', 'GPT-5', {}, { latest, featured })
    .model('gpt-5-mini', 'GPT-5 mini', {}, { latest, featured })
```

**Callback 패턴**:

```typescript
category(
    categoryId: string,
    categoryName: string,
    callback: (categoryBuilder: CategoryBuilder) => void
): this {
    const categoryBuilder = new CategoryBuilder(categoryId, categoryName);
    callback(categoryBuilder);  // Callback으로 설정
    this.#categories.push(categoryBuilder);
    return this;
}
```

### 2. Singleton Pattern

`ModelDeclaration`은 Singleton 패턴 사용:

```typescript
class ModelDeclaration {
    static #instance: ModelDeclaration;

    static getInstance() {
        if (!ModelDeclaration.#instance) {
            ModelDeclaration.#instance = new ModelDeclaration();
        }
        return ModelDeclaration.#instance;
    }

    private constructor() {
        // 초기화 로직
    }
}
```

**사용법**:
```typescript
// 클래스가 아닌 인스턴스를 export
const modelDeclaration = ModelDeclaration.getInstance();
export default modelDeclaration;
```

### 3. Factory/Initializer Pattern

프로바이더별 표준화된 초기화 함수:

```typescript
function initProvider(builder: CategoryBuilder) {
    const genAPI = {
        endpoint: 'generative_language',
        supportGeminiSafetyFilter: true,
    };

    builder.group('Gemini 2.5', genAPI, {})
        .model('gemini-2.5-pro', 'Gemini 2.5 Pro', {}, { latest, featured })
}

export default initProvider;
```

각 프로바이더별 initializer:
- `initOpenAIModel` - OpenAI 모델
- `initClaudeModel` - Anthropic 모델
- `initGeminiModel` - Google 모델
- `initVertexAIModel` - VertexAI 모델

### 4. Configuration Inheritance Pattern

설정의 계층적 상속:

```typescript
// 1. 기본 설정
const DEFAULT_CHATAI_CONFIG = { ... }

// 2. 그룹 레벨 설정
builder.group('GPT-5', { endpoint: 'chat_completions', thinking: 'enabled' }, {})

// 3. 모델 레벨 설정 (그룹 설정과 병합)
.model('gpt-5', 'GPT-5', { excludeParameter: [...] }, { latest, featured })
```

**병합 계층**:
```
DEFAULT_CHATAI_CONFIG
  → baseModelConfig (그룹 레벨)
    → config (모델 레벨)
      = 최종 모델 설정
```

### 5. Registry Pattern

`ModelDeclaration`이 레지스트리 역할:

```typescript
#parseMap(): Record<string, ChatAIModel> {
    const map: Record<string, ChatAIModel> = {};

    for (const category of this.#categories) {
        for (const group of category.groups) {
            for (const model of group.models) {
                map[model.metadataId] = model;  // ID로 인덱싱
            }
        }
    }
    return map;
}
```

**두 가지 접근 방법 제공**:
- `categories()`: 계층적 뷰
- `getModelMap()`: ID로 플랫한 조회

---

## 🎨 Export 패턴

### 패턴 1: Barrel Exports (Index 파일)

모든 `index.ts` 파일은 barrel export 패턴 사용:

```typescript
// features/model-builder/index.ts
export { default as ModelListBuilder } from './ModelListBuilder';
export { default as CategoryBuilder } from './CategoryBuilder';
export { default as GroupBuilder } from './GroupBuilder';
```

```typescript
// features/chatai-models/modelInitializer/index.ts
export { default as initOpenAIModel } from './openAI';
export { default as initClaudeModel } from './claude';
export { default as initGeminiModel } from './gemini';
export { default as initVertexAIModel } from './vertexAI';
```

### 패턴 2: Default Exports (클래스)

각 클래스 파일은 default export:

```typescript
export default ModelListBuilder;
export default CategoryBuilder;
export default GroupBuilder;
```

### 패턴 3: Singleton Instance Export

Singleton은 인스턴스를 export:

```typescript
// ModelDeclaration.ts에서 클래스 정의
// index.ts에서 싱글톤 인스턴스 export:
import ModelDeclaration from './ModelDeclaration';

const modelDeclaration = ModelDeclaration.getInstance();

export default modelDeclaration;
```

### 패턴 4: Named Exports (데이터)

데이터/설정 파일은 named export:

```typescript
export const configFlags = { ... };
export const flags = { ... };
export const DEFAULT_CHATAI_CONFIG = { ... };
export type DefaultChatAIConfig = typeof DEFAULT_CHATAI_CONFIG;
```

### 패턴 5: Path Alias 사용

내부 import는 `@/` alias 일관되게 사용:

```typescript
import { CategoryBuilder } from '@/features/model-builder';
import { flags } from '@/data';
```

---

## 📊 데이터 조직 패턴

### 1. 계층적 데이터 구조

3단계 계층:

```
Category (예: "OpenAI")
  └─ Group (예: "GPT-5")
      └─ Model (예: "gpt-5")
```

### 2. Metadata 구성

각 모델은 복합 메타데이터를 가짐:

```typescript
const model: ChatAIModel = {
    metadataId: this.#categoryId + ':' + id,  // 복합 ID
    modelId: id,                               // 프로바이더 ID
    displayName: name,                         // 사람이 읽을 수 있는 이름
    config: { ... },                          // 병합된 설정
    flags: { ... },                           // 기능 플래그
};
```

### 3. Flag-Based Features

모델 기능을 나타내는 boolean 플래그:

```typescript
const flags = {
    featured: true,      // 추천 모델
    stable: true,        // 안정 버전
    latest: true,        // 최신 버전
    deprecated: true,    // 사용 중단
    snapshot: true,      // 스냅샷/프리뷰
    highCost: true,      // 고비용 모델
}
```

선택적으로 모델에 적용:
```typescript
.model('gpt-5', 'GPT-5', {}, { latest, featured })
.model('gpt-4', 'GPT-4', {}, { deprecated })
```

### 4. Configuration Flags

모델 기능 플래그:

```typescript
const configFlags = {
    supportThinkingBudget: true,
    supportThinkingEffort: true,
    supportThinkingSummary: true,
    supportVerbosity: true
}
```

### 5. TypeScript Type Safety

`satisfies`로 강한 타입 안정성:

```typescript
export const DEFAULT_CHATAI_CONFIG = {
    // ... config
} satisfies ChatAIConfig;

export const flags = {
    // ... flags
} satisfies Required<ChatAIFlags>;
```

---

## 🔧 특수 패턴 & 관례

### 1. Method Chaining (Fluent Interface)

모든 builder 메서드는 `this` 또는 다음 builder를 반환:

```typescript
category(...): this {
    // ...
    return this;
}

group(...): GroupBuilder {
    // ...
    return group;  // 체이닝을 위한 builder 반환
}

model(...) {
    // ...
    return this;
}
```

### 2. Callback Configuration

중첩 설정을 위한 고차 함수 패턴:

```typescript
.category('openai', 'OpenAI', (c) => {
    // c는 CategoryBuilder
    c.group(...).model(...).model(...);
})
```

### 3. Destructuring for Clarity

함수 시작 부분에 상수 구조 분해:

```typescript
const {
    latest,
    featured,
    deprecated,
    snapshot,
} = flags;

const {
    supportThinkingEffort,
    supportVerbosity
} = configFlags;
```

### 4. Partial Configuration Objects

재사용 가능한 부분 설정:

```typescript
const completionsAPI: Partial<ChatAIConfig> = {
    endpoint: 'chat_completions'
};

const resAPI: Partial<ChatAIConfig> = {
    endpoint: 'responses'
};

// 여러 곳에서 사용:
builder.group('GPT-4o', completionsAPI, {})
builder.group('GPT-4.1', completionsAPI, {})
```

### 5. Spread Operator for Merging

설정 병합에 객체 spread 일관되게 사용:

```typescript
config: {
    ...this.#baseModelConfig,
    ...config,
}

flags: {
    ...this.#baseModelFlags,
    ...flags,
}
```

### 6. Private Class Fields (ES2022)

TypeScript `private` 대신 모던 JavaScript private fields:

```typescript
class CategoryBuilder {
    #id: string;              // Private field
    #name: string;            // Private field
    #groups: GroupBuilder[];  // Private field
}
```

**장점**:
- 런타임 프라이버시 (컴파일 타임만이 아님)
- 클래스 외부에서 접근 불가
- 공개 API와 이름 충돌 없음

### 7. Build Method Pattern

각 builder는 `build()` 메서드를 가짐:

```typescript
build(): ChatAIModelData {
    return this.#categories.map(category => category.build());
}

build(): ChatAIModelCategory {
    return {
        categoryId: this.#id,
        categoryName: this.#name,
        groups: this.#groups.map(g => g.build()),
    }
}
```

### 8. Constructor Options Interface

타입 안전한 생성자 파라미터:

```typescript
interface GroupBuilderOptions {
    categoryId: string;
    baseModelConfig: ChatAIConfig;
    baseModelFlags: ChatAIFlags;
}

constructor(groupName: string, options: GroupBuilderOptions) {
    // 파라미터에서 구조 분해
}
```

---

## 🔨 빌드 & 모듈 시스템

### 패키지 설정

- **Dual module format**: CommonJS (`bundle.cjs`) + ES Modules (`bundle.mjs`)
- **타입 정의**: `dist/index.d.ts`에 생성
- **Source maps**: 디버깅용으로 활성화
- **Path aliases**: `@/`는 `src/`에 매핑

### TypeScript 설정

- **Target**: ES2022
- **Strict mode**: 활성화
- **Private fields**: 네이티브 지원
- **Module resolution**: Node10

### 빌드 도구

- **Rollup**: 번들링
- **플러그인**: TypeScript, Node resolution, CommonJS, JSON
- **Outputs**: CJS, ESM, 타입 정의

---

## 💡 개발자 가이드

### 네이밍 규칙

1. 클래스: `PascalCase`
2. 함수/메서드: `camelCase`
3. Private 필드: `#camelCase`
4. 상수: `SCREAMING_SNAKE_CASE` 또는 객체는 `camelCase`
5. 파일: 클래스명 일치 (PascalCase) 또는 유틸리티는 camelCase

### 조직화 규칙

1. Feature-based 디렉토리
2. `index.ts`를 통한 barrel export
3. 최대 3단계 깊이
4. Builder와 Declaration 분리

### 패턴 사용

1. **Builder pattern**: Fluent interface로 구성
2. **Singleton pattern**: 모델 레지스트리
3. **Factory pattern**: 프로바이더 초기화
4. **Registry pattern**: 모델 조회
5. **Configuration inheritance**: Spread operator로 병합

### 베스트 프랙티스

1. Private class fields (`#field`) 사용
2. 메서드 체이닝을 위해 `this` 반환
3. 타입 안정성을 위해 `satisfies` 사용
4. 함수 시작 시 상수 구조 분해
5. 재사용 가능한 부분 설정 객체 생성
6. Singleton은 인스턴스를 export, 클래스가 아님
7. 내부 import는 path alias (`@/`) 사용

---

## 📚 주요 아키텍처 특징

이 코드베이스는 다음을 보여줍니다:

- ✅ 잘 조직된 패턴 기반 접근
- ✅ 강한 TypeScript 타이핑
- ✅ 모던 JavaScript 기능 (ES2022)
- ✅ Builder 패턴으로 우아한 DSL 제공
- ✅ Singleton 레지스트리로 효율적인 모델 메타데이터 접근

---

**마지막 업데이트**: 2025-11-09
