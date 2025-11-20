# packages/core

애플리케이션의 비즈니스 로직을 담당하는 코어 라이브러리. Electron과 독립적으로 동작 가능한 플랫폼 독립적 모듈.

## 외부 Export (src/index.ts)

### Logger
- **경로**: `src/features/logger/AfronLogger.ts`
- **용도**: 계층적 로그 출력 (trace, debug, info, warn, error, fatal)
- **타입**: `LogLevel` enum export

### NoLogger
- **경로**: `src/features/nologger/`
- **용도**: 로그를 출력하지 않는 Null Object 패턴 구현

### RTWorker
- **경로**: `src/features/rt-worker/RTWorker.ts`
- **용도**: RT(Request Template) 실행 엔진
- **역할**: 프롬프트 실행, Workflow 처리, ChatAI API 호출, 스트리밍 응답 처리
- **주요 하위 모듈**:
  - `workflow/` - Workflow 실행 로직 (PromptOnly, Flow, Preview)
  - `nodes/` - Workflow 노드 타입 (ChatAIFetchNode, PromptBuildNode 등)
  - `prompt-generator/` - 프롬프트 생성기 (Chat, File, Files, Input)

### RTPacker
- **경로**: `src/features/rt-packer/packer.ts`
- **용도**: RT 데이터를 압축/해제하여 파일로 저장/로드

### GlobalEventEmitter
- **경로**: `src/features/event-emitter/GlobalEventEmitter.ts`
- **용도**: 전역 이벤트 버스 (앱 전체 이벤트 전달)

### PromptOnlyTemplateFactory
- **경로**: `src/features/rt-template-factory/PromptOnlyTemplateFactory.ts`
- **용도**: PromptOnly 템플릿으로부터 새 RT 생성
- **관련**: `RTPromptOnlyTemplateTool` - 템플릿 생성 도구 (디버그용 노출)

### FlowTemplateFactory
- **경로**: `src/features/rt-template-factory/FlowTemplateFactory.ts`
- **용도**: Flow 템플릿으로부터 새 RT 생성

### Profiles
- **경로**: `src/features/profiles/Profiles.ts`
- **용도**: 프로필 컬렉션 관리 (생성, 삭제, 목록 조회, 마지막 프로필 추적)
- **타입 export**: `Profile`

### Profile
- **경로**: `src/features/profiles/Profile/Profile.ts`
- **용도**: 개별 프로필 관리 (모델 설정, 세션 관리, RT 관리, 스토리지 접근)
- **주요 하위 모듈**:
  - `ProfileModel.ts` - 커스텀 모델 및 전역 모델 설정
  - `ProfileSession.ts` - 개별 세션 (폼 값, 히스토리, 파일 관리)
  - `ProfileSessions.ts` - 세션 컬렉션 (추가, 삭제, 순서 변경)
  - `rt/` - RT 관리 (메타데이터, 프롬프트, Workflow, 폼 컨트롤)

### MasterKeyManager
- **경로**: `src/features/masterkey-manager/MasterKeyManager.ts`
- **용도**: 마스터 키 관리 및 암호화/복호화
- **역할**: 하드웨어 키 생성, 복구 키 발급, 프로필 데이터 암호화
- **타입 export**: `MasterKeyInitResult`, `IMasterKeyGettable`
- **관련**: `MockMasterKeyManager` - 테스트용 Mock 구현

### AppVersionManager
- **경로**: `src/features/app-version-manager/AppVersionManager.ts`
- **용도**: GitHub Release API를 통한 버전 관리 및 업데이트 확인

## 내부 모듈 (외부 미노출)

### chatai-fetcher
- **경로**: `src/features/chatai-fetcher/`
- **용도**: ChatAI API 호출 및 스트리밍 응답 처리
- **역할**: @hve/chatai 라이브러리 래퍼, 폼 빌더 제공

### model-metadata-resolver
- **경로**: `src/features/model-metadata-resolver/`
- **용도**: 모델 메타데이터 해석 (기본 모델, 커스텀 모델 설정 적용)

### profile-control
- **경로**: `src/features/profile-control/`
- **용도**: Profile 관련 유틸리티 함수

### acstorage-accessor
- **경로**: `src/features/acstorage-accessor/`
- **용도**: ACStorage 접근 헬퍼 (JSON, Secret 등)

## 데이터 구조

### storage-tree
- **경로**: `src/data/storage-tree/`
- **파일**: `storage-tree.ts`, `request-template-tree.ts`, `form-json-tree.ts`
- **용도**: 스토리지 계층 구조 정의 (프로필, RT, 세션별 데이터 트리)

## 외부 의존성

### @afron/types
- IPC 인터페이스, RT 관련 타입, Storage 타입, ChatAI 타입 참조

### @hve/chatai
- ChatAI API 클라이언트 라이브러리

### ac-storage
- 파일 기반 Key-Value 스토리지 라이브러리

### advanced-prompt-template-lang
- 프롬프트 템플릿 파싱 및 변수 치환

## 참조 경로 요약

| 모듈 | 경로 | 용도 |
|------|------|------|
| Logger | `src/features/logger/` | 로그 출력 |
| RTWorker | `src/features/rt-worker/` | RT 실행 엔진 |
| Profiles | `src/features/profiles/Profiles.ts` | 프로필 컬렉션 |
| Profile | `src/features/profiles/Profile/` | 개별 프로필 |
| MasterKeyManager | `src/features/masterkey-manager/` | 암호화 키 관리 |
| AppVersionManager | `src/features/app-version-manager/` | 버전 관리 |
| RTPacker | `src/features/rt-packer/` | RT 파일 입출력 |
| TemplateFactory | `src/features/rt-template-factory/` | RT 템플릿 생성 |
| GlobalEventEmitter | `src/features/event-emitter/` | 전역 이벤트 |
| Storage Tree | `src/data/storage-tree/` | 스토리지 구조 정의 |
