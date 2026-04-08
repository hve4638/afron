# Code Organization Within Files

## Import 순서

### 일반적인 Import 순서 (암묵적 규칙)
정렬이 엄격하게 강제되지는 않으나, 관찰되는 일반적 순서:

1. **Node.js 내장 모듈**: `import * as fs from 'node:fs'`, `import * as path from 'node:path'`
2. **외부 라이브러리**: `import { create } from 'zustand'`, `import { ipcMain } from 'electron'`
3. **React 관련**: `import { useState, useCallback } from 'react'`
4. **Workspace 패키지**: `import { ... } from '@afron/types'`, `import { ... } from '@afron/core'`
5. **Path alias 내부 모듈**: `import { ... } from '@/features/...'`, `import { ... } from '@/types'`
6. **상대 경로 모듈**: `import { ... } from './errors'`, `import { ... } from '../nodes'`

### Import 스타일

#### type import 분리
`type` keyword를 사용하여 타입 전용 import 분리:
```typescript
import type { Profile } from '@/features/profiles';
import type { LevelLogger } from '@/types';
import type { NodeData } from './types';
```

#### 일반 import과 type import 혼용
일부 파일에서는 inline `type` 사용:
```typescript
import { type Profile } from '@afron/core';
```
또는 분리하지 않고 같이 import:
```typescript
import { ChatAIModel, CustomModel, ModelConfiguration } from '@afron/types';
```

#### Namespace import
유틸리티에서 주로 사용:
```typescript
import * as utils from '@utils';
import * as fs from 'node:fs';
import * as path from 'node:path';
```

---

## 클래스 내부 구조

### 필드 선언 순서
```typescript
class Profile {
    // 1. Private fields (#)
    #basePath: string | null;
    #storage: ACStorage;
    #sessionControl: ProfileSessions;
    #dropped: boolean = false;

    // 2. Protected fields
    protected logger: LevelLogger;

    // 3. Static factory method
    static async From(...) { ... }

    // 4. Private constructor
    private constructor(...) { ... }

    // 5. Initialize method
    async initialize() { ... }

    // 6. Private helper methods
    async #readPersonalKey(): Promise<string> { ... }

    // 7. Public methods - lifecycle
    async commit(): Promise<void> { ... }
    drop(): void { ... }

    // 8. Public getters
    get path(): string { ... }
    get sessions() { ... }

    // 9. Public methods - business logic
    session(sessionId: string) { ... }
    rt(rtId: string): ProfileRT { ... }

    // 10. Public async methods - CRUD operations
    async getRTTree() { ... }
    async addRT(metadata: RTMetadata) { ... }
    async removeRT(rtId: string) { ... }
}
```

### Abstract 클래스 구조
```typescript
abstract class WorkNode<NInput, NOutput, NOption extends object> {
    // 1. Protected fields
    protected _nodeId: number;
    protected name: string = 'Node';
    protected logger: LevelLogger;

    // 2. Constructor
    constructor(...) { ... }

    // 3. Protected getters
    protected get nodeId() { ... }

    // 4. Public template method
    async run(input: NInput): Promise<NOutput> { ... }

    // 5. Abstract method (하위 클래스에서 구현)
    protected abstract process(input: NInput): Promise<NOutput>;
}
```

---

## React 컴포넌트 파일 구조

### 함수 컴포넌트 파일
```typescript
// 1. React/라이브러리 import
import { useState, useCallback } from 'react';
import { ReactFlow, ReactFlowProvider } from '@xyflow/react';

// 2. 외부 타입 import
import { RTFlowData } from '@afron/types';

// 3. 내부 모듈 import
import { Grid } from '@/components/layout';
import { useWorkflow } from './Workflow.hooks';

// 4. 스타일 import
import styles from './Workflow.module.scss';

// 5. 내부 헬퍼 컴포넌트 (private)
function WorkflowInner({ children }: { children?: React.ReactNode }) {
    // ...
}

// 6. Props interface (export 직전)
export interface WorkflowProps {
    nodes: FlowNode[];
    edges: FlowEdge[];
    // ...
}

// 7. Main 컴포넌트 (named export)
export function Workflow({ nodes, edges, ... }: WorkflowProps) {
    return ( ... );
}
```

### Hook 분리 패턴
복잡한 로직은 별도 `.hook.tsx` / `.hooks.ts` 파일로 분리:
- `Workflow.hooks.ts` - `useWorkflow()` hook
- `RTEditModal.hook.tsx` - `useRTEditModal()` hook
- `ModelDropdown.hook.ts` - `useModelDropdown()` hook

### 컴포넌트 export 스타일
- 페이지/루트 컴포넌트: `export default App;` (default)
- Feature 내부 컴포넌트: named export `export function Workflow(...)` 또는 `export default`

---

## 파일 내 타입 정의 위치

### 로컬 타입은 사용처 바로 위에
```typescript
type WorkRequired = {
    profile: Profile;
    sessionId: string;
}

type WorkOptions = {
    preview?: boolean;
}

interface RTWorkSession {
    running: boolean;
    emitter: RTEventEmitter;
}

class RTWorker {
    // 위 타입들을 사용
}
```

### 공유 타입은 별도 `types.ts`
```typescript
// types.ts
export type ChatAIRequestAPI = typeof ChatAI.request;
export interface FormBuilderProps { ... }
```

---

## Zustand Store 파일 구조

```typescript
// 1. Import
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// 2. State 타입 정의
type MemoryStates = {
    profileId: string | null;
    allModels: ChatAIModelData;
    // ...
}

// 3. (Optional) 기본값 정의
const defaultConfig: ConfigFields = {
    font_size: 18,
    theme_mode: ThemeModes.SYSTEM_DEFAULT,
    // ...
};

// 4. Store 생성
const useMemoryStore = create<MemoryStates>(() => ({
    profileId: null,
    allModels: [],
    // ...
}));

// 5. Export
export default useMemoryStore;
```

---

## 주석/문서화 스타일

### JSDoc (드물게 사용)
주로 public API 메서드에만:
```typescript
/**
 * 현재 진행 중인 RT 작업을 중단
 * @param token
 */
abort(token: string): boolean { ... }

/**
 * 특정 Profile의 History, Store, Prompt 등을 관리
 */
class Profile { ... }
```

### 인라인 한국어 주석
가장 빈번하게 사용되는 주석 스타일:
```typescript
// 토큰 중복 여부 검사
// 토큰은 front단에서 생성하고 받아오므로 항상 검증 필요

/* 트리 */
/* RT 컨트롤 */

// 초기값은 어짜피 접근할 수 없으므로 빈 객체로 설정
```
- 섹션 구분: `/* 제목 */` 형식
- 동작 설명: `// 한국어 설명` 형식
- 타입 정의에 /** */ 사용: `/** 전송 전 데이터 미리 보기 모드 */`

### TODO/FIXME
```typescript
// @TODO
// 앞으로 더 많은 작업이 추가되면
// LoadGlobalDataPhase 처럼 작업 분리 필요
```

---

## 조건 렌더링 스타일 (React)

`&&` 연산자를 사용한 조건 렌더링:
```typescript
{
    phase === LoadPhase.Boot &&
    <ModalProvider>
        <Bootstrap />
    </ModalProvider>
}
{
    phase === LoadPhase.Main &&
    <Hub />
}
```
- 삼항 연산자보다 `&&` 패턴을 선호
- 각 조건 블록은 `{ }` 중괄호로 감싸고 줄바꿈
