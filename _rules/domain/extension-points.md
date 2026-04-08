# Extension Points

시스템이 확장을 위해 제공하는 인터페이스와 패턴.

## 1. AI 모델 공급자 확장

### 1.1 ModelDeclaration Builder 체인

새로운 AI 공급자 추가는 `ModelDeclaration` 내 Builder 체인으로 수행:

```typescript
// ModelDeclaration.ts - #load()
this.#builder
    .category('openai', 'OpenAI', (c) => initOpenAIModel(c))
    .category('google', 'Gemini', (c) => initGeminiModel(c))
    .category('anthropic', 'Anthropic', (c) => initClaudeModel(c))
    .category('vertexai', 'VertexAI', (c) => initVertexAIModel(c))
    // 새 공급자 추가: .category('newProvider', 'Display Name', (c) => initNewModel(c))
```

각 initializer는 `CategoryBuilder`를 받아 그룹과 모델을 선언한다.

### 1.2 API Endpoint 확장

`ChatAIConfig.endpoint` 필드로 API 통신 방식을 결정:

```typescript
type endpoint = 
    | 'chat_completions'      // OpenAI ChatCompletions API
    | 'responses'             // OpenAI Responses API
    | 'generative_language'   // Google Generative Language API
    | 'anthropic'             // Anthropic Messages API
    | 'vertexai_gemini'       // VertexAI (Gemini)
    | 'vertexai_claude';      // VertexAI (Claude)
```

새 endpoint 추가 시 변경 필요 지점:
1. `ChatAIConfig.endpoint` 타입에 추가
2. `ChatAIFetcher`에 요청 메서드 추가
3. `FormBuilder`에 해당 포맷 빌더 추가 (`BaseFormBuilder` 상속)
4. `ChatAIFetchNode.#getAPIName()`에 API 키 매핑 추가

### 1.3 FormBuilder 계층

API별 요청 폼 빌드는 `BaseFormBuilder`를 상속한 전용 빌더:

```
BaseFormBuilder (공통 필드 처리)
  ├── ChatCompletionFormBuilder   -- OpenAI ChatCompletions
  ├── ResponsesFormBuilder        -- OpenAI Responses
  ├── GeminiFormBuilder           -- Google Generative Language
  ├── AnthropicFormBuilder        -- Anthropic Messages
  └── VertexAIFormBuilder         -- VertexAI
```

`FormBuilder` 파사드 클래스가 호출자에게 통합 인터페이스 제공.

### 1.4 커스텀 모델

사용자가 직접 모델을 정의하여 호환 API에 연결:

- `CustomModel` 타입: name, model, url, api_format, secret_key
- 지원 api_format: `chat_completions`, `anthropic_claude`, `generative_language`
- `custom:` prefix가 붙은 ID로 내장 모델과 구분

## 2. RT 워크플로우 확장

### 2.1 WorkNode 추상 클래스

워크플로우의 각 처리 단계는 `WorkNode<NInput, NOutput, NOption>`을 상속:

```typescript
abstract class WorkNode<NInput, NOutput, NOption extends object> {
    abstract process(input: NInput): Promise<NOutput>;
}
```

기존 노드 구현:
- `InputNode` -- 사용자 입력 수집
- `PromptBuildNode` -- APTL 프롬프트 컴파일/실행
- `ChatAIFetchNode` -- AI API 호출
- `ChatAIPreviewNode` -- API 요청 미리보기
- `OutputNode` -- 결과 출력
- `StringifyChatMLNode` -- ChatML 문자열화
- `StringifyNode` -- 일반 문자열화

### 2.2 RTWorkflow 추상 클래스

워크플로우 실행 전략은 `RTWorkflow`를 상속:

```typescript
abstract class RTWorkflow {
    abstract process(input: RTInput): Promise<any>;
    protected async getNodeData(rtInput: RTInput): Promise<NodeData>;
}
```

기존 구현:
- `WorkflowPromptOnly` -- 단일 프롬프트 파이프라인
- `WorkflowPromptPreview` -- 프롬프트 미리보기 (API 호출 없이)
- `WorkflowMirror` -- (미러링)

### 2.3 RT 모드 확장

`RTMode = 'prompt_only' | 'flow'`

- `prompt_only`: 선형 파이프라인 (InputNode -> PromptBuildNode -> ChatAIFetchNode -> OutputNode)
- `flow`: 노드 그래프 기반 (RTFlowData로 정의, 프론트엔드 workflow editor로 편집)

Flow 모드의 노드 타입 (`FlowNodeType`):
- `rt-run` -- 워크플로우 시작점
- `rt-output` -- 결과 출력점
- `prompt-template` -- 프롬프트 템플릿
- `llm-fetch` -- LLM API 호출

### 2.4 RT 템플릿 팩토리

새 RT 생성 시 초기 데이터를 제공하는 팩토리:

```typescript
PromptOnlyTemplateFactory.normal(profile, rtId, name)   // 기본 입력
PromptOnlyTemplateFactory.chat(profile, rtId, name)      // 채팅 모드
PromptOnlyTemplateFactory.translate(profile, rtId, name)  // 번역 템플릿
PromptOnlyTemplateFactory.debug(profile, rtId, name)      // 디버그용
PromptOnlyTemplateFactory.empty(profile, rtId, name)      // 빈 템플릿

FlowTemplateFactory.normal(profile, rtId, name)
FlowTemplateFactory.empty(profile, rtId, name)
```

`templateId` 문자열로 선택되며, `Profile.createUsingTemplate()`에서 분기.

## 3. ACStorage 커스텀 Accessor

`ACStorage.addAccessEvent(type, lifecycle)` 로 커스텀 저장소 타입 등록:

```typescript
storage.addAccessEvent('history', {
    async init(fullPath) { return new HistoryAccessor(fullPath); },
    async save(ac) { return await ac.commit(); },
    async destroy(ac) { await ac.drop(); }
});

storage.addAccessEvent('secret-json', {
    async init(fullPath, tree) { /* AES 기반 암호화 JSON */ },
    async create(ac) { },
    async exists(ac) { return await ac.hasExistingData(); },
    async load(ac) { return await ac.load(); },
    async save(ac) { return await ac.save(); },
    async destroy(ac) { return await ac.drop(); },
});
```

새로운 저장소 타입은 이 패턴을 따라 추가 가능.

## 4. IPC 핸들러 확장

### 4.1 Backend (Electron Main)

새 IPC 카테고리 추가:
1. `@afron/types`에서 `IPCInvokers` 네임스페이스에 인터페이스 선언
2. `IPCInvokerInterface`에 카테고리 추가
3. `packages/electron/src/ipc/handlers/`에 핸들러 구현
4. `handlers/index.ts`에서 핸들러 등록

### 4.2 Frontend (Preload)

`preload.ts`의 `ipcInvokerPath` 객체에 동일한 구조 반영.
`satisfies IPCInvokerPath` 타입 검증으로 누락 방지 (빌드 시 타입 에러).

## 5. RTEventEmitter 이벤트 확장

`RTEventData` 유니온 타입에 새 이벤트 타입 추가:

1. `@afron/types`의 `event.d.ts`에 타입 추가
2. `RTEventEmitter`의 `emit` 객체에 발행 메서드 추가
3. `responseReceiver.ts`에 수신 처리 로직 추가

## 6. RTVar 데이터 타입 확장

`RTVarData.type`에 새 폼 입력 타입 추가 가능:
- 현재: `text`, `number`, `checkbox`, `select`, `array`, `struct`
- 각 타입은 `RTVarConfig` 네임스페이스에 설정 타입 정의
- `array`의 `element_type`으로도 사용 가능
- `struct`의 `fields`에서 필드 타입으로도 사용 가능 (재귀적이지 않음, 1단계)

## 7. 프론트엔드 이벤트 파이프

`IPCListenerPing` 채널별로 리스너 등록:

```typescript
ipcListeners.events = {
    onRequest: (listener) => { /* RT 요청 이벤트 */ },
    onGlobal: (listener) => { /* 전역 이벤트 */ },
    onDebug: (listener) => { /* 디버그 이벤트 */ },
    off: (bindId) => { /* 리스너 해제 */ },
}
```

새 이벤트 채널은 `IPCListenerPing`에 추가하고 preload에서 등록하면 된다.
