import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useBus } from '@/lib/zustbus';

import { emitNavigate } from '@/events/navigate';
import { useRTStore } from '@/context/RTContext';
import { ChoiceDialog } from '@/modals/Dialog';
import { convertPromptVarToRTVar, convertRTVarToPromptVar } from './utils';

import type {
    PromptData,
} from '@/types';
import { usePromptEditorData } from './hooks';
import { VarEditModal, PromptOnlyConfigModal } from './modals';

import { PromptEditorEvent } from './types';
import { useModal } from '@/features/modal';

function usePromptEditor() {
    const modal = useModal();
    const { rtId, promptId } = useParams();

    const promptEditorData = usePromptEditorData();
    const rtState = useRTStore();

    const [emitPromptEditorEvent, usePromptEditorEvent] = useBus<PromptEditorEvent>();

    const isChanged = () => {
        const data = promptEditorData.value;
        if (!data) return false;

        let changed = false;
        changed ||= Object.values(data.changed).some(v => v == true);
        changed ||= Object.entries(data.changedVariables).some(() => true);
        changed ||= (data.removedVariables.length > 0);

        return changed;
    }

    const save = async () => {
        emitPromptEditorEvent('on_save');

        if (!rtId || !promptId) {
            console.info('RT ID or Prompt ID is missing');
            return;
        }
        if (!promptEditorData.value) {
            console.info('Prompt data is not loaded');
            return;
        }
        if (!isChanged()) {
            console.info('No changes to save');
            return;
        }

        const data = promptEditorData.value;
        if (data.changed.name && data.name) {
            await rtState.update.promptName(promptId, data.name);
        }

        {
            const param: Parameters<typeof rtState.update.metadata>[0] = {};
            if (data.changed.version && data.version) {
                param.version = data.version;
            }
            if (data.changed.config && data.promptOnly.enabled) {
                param.input_type = data.promptOnly.inputType;
            }
            if (Object.keys(param).length > 0) {
                await rtState.update.metadata(param);
            }
        }
        {
            const param: Parameters<typeof rtState.update.promptMetadata>[1] = {};

            if (data.promptOnly.enabled && data.changed.model) {
                param.model = data.promptOnly.model;
            }
            if (data.changed.contents) {
                param.contents = data.contents;
            }
            if (Object.keys(param).length > 0) {
                await rtState.update.promptMetadata(data.promptId, param);
            }
        }

        if (Object.entries(data.changedVariables)) {
            const promptVars = Object.values(data.changedVariables);
            const rtVars = promptVars.map(convertPromptVarToRTVar);

            const variableIds = await rtState.update.promptVars(data.promptId, rtVars);

            for (const i in variableIds) {
                if (promptVars[i].id === variableIds[i]) continue;

                promptEditorData.action.changeVarId(promptVars[i].id, variableIds[i]);
            }
        }

        if (data.removedVariables.length > 0) {
            await rtState.remove.promptVars(data.promptId, data.removedVariables);
        }

        promptEditorData.action.clearChanged();
    }

    const back = async () => {
        if (isChanged()) {
            modal.open(<ChoiceDialog 
                title='작업을 저장하겠습니까?'
                choices={[
                    { text: '저장', tone: 'highlight' },
                    { text: '저장하지 않음' },
                    { text: '취소', tone: 'dimmed' },
                ]}
                onSelect={async (choice: string, index: number) => {
                    if (index === 0) { // 저장
                        await save();
                        emitPromptEditorEvent('save');
                        emitNavigate('back');
                    }
                    else if (index === 1) { // 저장하지 않음
                        emitNavigate('back');
                    }
                    else if (index === 2) { // 취소
                        return true;
                    }
                    return true;
                }}
                onEnter={async () => {
                    await save();
                    emitNavigate('back');
                    return true;
                }}
                onEscape={async () => true}
                children={<span>저장되지 않은 변경사항이 있습니다</span>}
            />);
        }
        else {
            emitNavigate('back');
        }
    }

    usePromptEditorEvent('save', async () => {
        save();
    }, [rtId, promptId]);

    usePromptEditorEvent('back', async () => {
        back();
    }, []);
    usePromptEditorEvent('open_varedit_modal', async ({ varId }) => {
        modal.open(<VarEditModal 
            varId={varId}
            promptEditorData={promptEditorData}
        />);
    }, []);
    usePromptEditorEvent('open_prompt_only_config_modal', async () => {
        modal.open(<PromptOnlyConfigModal 
            promptEditorData={promptEditorData}
        />);
    }, []);

    // 초기 프롬프트 데이터 로드
    const load = async () => {
        if (!(rtId && promptId)) return;

        const { input_type, mode, version } = await rtState.get.metadata();
        const { name, model } = await rtState.get.promptMetadata(promptId);
        const contents = await rtState.get.promptContents(promptId);
        const vars = await rtState.get.promptVars(promptId);

        console.log('loaded', vars);

        /// @TODO : 원래 model은 반드시 valid하게 와야하는데 {}만 오는 문제
        // 현재는 처리되는지 확인 필요
        const data: PromptData = {
            rtId,
            promptId,
            name,
            version,
            contents,
            variables: vars.map(convertRTVarToPromptVar),
            config: {},
            flags: {
                syncRTName: true,
            },
            promptOnly: {
                enabled: true,
                inputType: input_type,
                model,
            },

            changed: {},
            changedVariables: {},
            addedVariables: [],
            removedVariables: [],
        };
        promptEditorData.reset(data);
    }

    useEffect(() => {
        load();
    }, []);

    return {
        promptEditorData,
        promptEditorEvent: {
            emitPromptEditorEvent,
            usePromptEditorEvent
        },
        promptEditorUpdateEvent: {
            emitPromptEditorEvent,
            usePromptEditorEvent,
        }
    }
}

export default usePromptEditor;