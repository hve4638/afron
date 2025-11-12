import { usePromptEditorData } from './usePromptEditorData';

export type PromptEditorData = ReturnType<(typeof usePromptEditorData)>;
export type PromptEditorDataAction = ReturnType<(typeof usePromptEditorData)>['action'];
export type PromptEditorDataVarAction = ReturnType<(typeof usePromptEditorData)>['varAction'];
export type PromptEditorDataGetter = ReturnType<(typeof usePromptEditorData)>['get'];

export {
    usePromptEditorData
}