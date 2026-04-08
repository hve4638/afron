# Data Flow

## 전체 아키텍처 개요

Afron은 3-tier Electron 아키텍처를 따른다:

```
[Frontend (React/Zustand)]  <--IPC-->  [Electron Main Process]  <-->  [Core 비즈니스 로직]
      (renderer process)                (main process)                  (라이브러리)
```

외부 AI API와의 통신은 Core 계층의 `ChatAIFetcher`가 담당한다.

## 1. AI 요청 흐름 (Request Flow)

사용자가 프롬프트를 입력하고 전송하는 전체 흐름:

### 1.1 Frontend -> Electron (요청 시작)

```
사용자 전송 버튼 클릭
  -> RequestManager.request(profileId, sessionId)
    -> RequestEventPipe.request() -- 채널 ID(UUIDv7) 생성
      -> RequestAPI.request() -- Channel<RTEventData> 생성 (프론트엔드 채널)
        -> LocalAPI.request.requestRT(chId, profileId, sessionId)
          -> ipcRenderer.invoke('request_requestRT', chId, profileId, sessionId)
```

### 1.2 Electron Main -> Core (요청 처리)

```
ipcMain.handle('request_requestRT')
  -> handler: request.ts
    -> runtime.profiles.getProfile(profileId) -- Profile 인스턴스 획득
    -> runtime.rtWorker.request(token, { profile, sessionId }, { preview: false })
```

### 1.3 RTWorker 내부 처리 (Core)

```
RTWorker.request()
  -> session에서 rt_id, model_id, input, form 등 수집 -> RTInput 구성
  -> RTEventEmitter 생성 및 핸들러 등록
  -> 세션 등록 (token -> RTWorkSession)
  -> 입력 필드 초기화 (clear_on_submit 설정에 따라)
  -> RTWorkflow 생성 (preview ? WorkflowPromptPreview : WorkflowPromptOnly)
  -> workflow.process(rtInput) -- 비동기 실행 (fire-and-forget)
```

### 1.4 WorkflowPromptOnly 실행 (Core)

프롬프트 기반 RT의 핵심 처리 파이프라인:

```
WorkflowPromptOnly.process(rtInput)
  +--> getNodeData() -- 히스토리에서 채팅 이력 로드, NodeData 구성
  |
  +--> InputNode.run({})
  |      입력 텍스트/파일 -> data.input에 기록
  |      출력: { input: { text, files } }
  |
  +--> PromptBuildNode.run({ input })
  |      1. RT 변수(RTVar) 로드 및 폼 값 바인딩
  |      2. APTL(Advanced Prompt Template Lang)로 프롬프트 컴파일
  |      3. APTL 실행 -> ChatMessages 생성 (role, text, image, file)
  |      4. 내장 변수: {{:input}}, {{:chat}} 자동 주입
  |      출력: { messages: ChatMessages }
  |
  +--> ChatAIFetchNode.run({ messages })
  |      1. preprocess(): 모델 메타데이터 + API 키 + 모델 설정 수집
  |      2. FormBuilder로 API별 요청 폼 구성
  |      3. ChatAIFetcher.request() -> @hve/chatai 라이브러리 호출
  |      4. 응답 검증 (HTTP status 확인)
  |      출력: { result: ChatAIResult }
  |
  +--> OutputNode.run({ output: result })
  |      응답 텍스트를 data.output에 기록
  |      rtEventEmitter.emit.output.set(text) -- 프론트엔드에 결과 전달
  |
  +--> 히스토리 기록 (addHistory -> addHistoryMessage -> completeHistory)
```

### 1.5 이벤트 역방향 흐름 (Core -> Frontend)

```
RTEventEmitter.emit.output.set(text)
  -> EventEmitter.emit('default', { id, type: 'set_output', text })
    -> 등록된 RTEventListener 호출
      -> BrowserWindow.webContents.send(IPCListenerPing.Request, token, data)
        -> ipcRenderer.on() -- preload에서 등록
          -> RequestAPI.#onRequest(event, chId, data)
            -> Channel.produce(data) -- 프론트엔드 채널에 데이터 전달
```

### 1.6 Frontend 응답 수신 (Response Loop)

```
responseReceiver(chId, sessionAPI)  -- RequestManager에서 시작
  while (true):
    data = await RequestEventPipe.receive(chId)  -- Channel.consume() 대기
    
    switch (data.type):
      'close'                -> 상태 'done'으로 변경, 루프 종료
      'set_output'           -> 세션 output 저장, UI 갱신
      'update'               -> input/output/history 개별 refetch
      'error'                -> ErrorTool로 에러 유형별 처리
      'send_raw_request_preview' -> 미리보기 모달 열기
      'send_info'            -> (현재 비활성)
```

## 2. 프로필 데이터 흐름

### 2.1 Frontend Store <-> Backend Storage

프론트엔드 Zustand 스토어는 백엔드 ACStorage의 미러:

```
useSessionStore (zustand)
  ├── CacheFields  <--> session/{id}/cache.json  (input, output, state, upload_files)
  ├── ConfigFields <--> session/{id}/config.json  (name, model_id, rt_id, color)
  └── DataFields   <--> session/{id}/data.json    (running_rt, forms)

useCacheStore     <--> profile/cache.json    (last_session_id, 설정 캐시)
useConfigStore    <--> profile/config.json   (프로필 설정: 테마, 레이아웃, 기능 토글)
useDataStore      <--> profile/data.json     (sessions, api_keys, custom_models)
```

각 스토어는 `update`와 `refetch` 메서드를 제공:
- `update.fieldName(value)` -> IPC로 백엔드에 저장 + 로컬 상태 갱신
- `refetch.fieldName()` -> IPC로 백엔드에서 최신값 조회 + 로컬 상태 갱신

### 2.2 IPC 통신 프로토콜

모든 IPC 호출은 동일한 패턴을 따른다:

```typescript
// 결과 타입
type EResult<T> = Promise<readonly [EError] | readonly [null, T]>;
type ENoResult = Promise<readonly [EError | null]>;

// 호출: ipcRenderer.invoke(`${category}_${method}`, ...args)
// 응답: [null, data] (성공) 또는 [{ name, message }] (에러)
```

IPC 채널 이름은 `{category}_{method}` 형식:
- `general_echo`, `profiles_create`, `profileSession_getFormValues` 등
- preload.ts에서 `ipcInvokerPath` 객체로 타입 안전하게 정의

## 3. 모델 설정 해석 흐름 (Model Configuration Resolution)

```
사용자 요청 시:
  1. 글로벌 모델 설정: profile.model.getGlobalModelConfig(modelId)
  2. RT 프롬프트 모델 설정: rt.prompt.getMetadata(promptId).model
  3. resolveModelConfiguration([globalConfig], [promptModel])
     -> 우선순위에 따라 temperature, top_p, max_tokens, thinking 등 병합
  4. FormBuilder가 최종 설정으로 API 요청 폼 구성
```

## 4. 이벤트 시스템

### 4.1 RT Event (요청-응답 이벤트)

- **경로**: Core -> Electron -> Frontend
- **데이터 타입**: `RTEventData` (discriminated union on `type`)
- **이벤트 유형**: `update`, `set_output`, `stream_output`, `clear_output`, `error`, `send_raw_request_preview`, `send_info`, `close`
- **전송 채널**: `IPCListenerPing.Request`
- **프론트엔드 수신**: `Channel<RTEventData>` (producer-consumer 패턴)

### 4.2 Global Event (전역 이벤트)

- **경로**: Core -> Electron -> Frontend
- **데이터 타입**: `GlobalEventData`
- **이벤트 유형**: `rt_export` (ready/progress/done/cancel), `rt_import` (ready/failed/done/cancel), `close`
- **전송 채널**: `IPCListenerPing.Global`
- **용도**: RT 내보내기/가져오기 진행상황

### 4.3 Frontend Event (UI 내부 이벤트)

- `emitEvent('refresh_chat')` -- 채팅 UI 갱신
- `emitEvent('refresh_session_metadata')` -- 세션 메타데이터 갱신
- `emitEvent('open_rt_preview_modal', data)` -- 미리보기 모달
