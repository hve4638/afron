import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { emitNavigate } from '@/events/navigate';
import { useRTStore } from '@/context/RTContext';
import { useModal } from '@/hooks/useModal';
import { ChoiceDialog } from '@/modals/Dialog';
import { convertPromptVarToRTVar, convertRTVarToPromptVar } from './utils';

import type {
    PromptEditorData,
} from '@/types';
import { usePromptEditorData } from './hooks';
import { useBus } from '@/lib/zustbus';
import { PromptEditorEvent } from './types';
import VarEditModal from './VarEditModal';
import { PromptOnlyConfigModal } from './modals';

interface usePromptEditorProps {
}

function usePromptEditor({

}: usePromptEditorProps) {
    const { t } = useTranslation();
    const modal = useModal();
    const { rtId, promptId } = useParams();

    const promptEditorData = usePromptEditorData({});
    const rtState = useRTStore();

    const [_, emitPromptEditorEvent, usePromptEditorEvent] = useBus<PromptEditorEvent>();

    const isChanged = () => {
        if (!promptEditorData.value) return false;

        const editorData = promptEditorData.value;
        let changed = Object.entries(editorData.changed).some(([key, value]) => value === true);
        changed = changed && Object.entries(editorData.changedVariables).some(() => true);
        changed = changed && editorData.removedVariables.length > 0;

        return changed;
    }

    const save = async () => {
        if (!rtId || !promptId) return;
        if (!promptEditorData.value) return;
        if (!isChanged()) return;

        const data = promptEditorData.value;
        if (data.changed.name && data.name) {
            await rtState.update.promptName(promptId, data.name);
        }

        {
            const param: Parameters<typeof rtState.update.metadata>[0] = {};
            if (data.changed.version && data.version) {
                param.version = data.version;
            }
            if (data.changed.config) {
                param.input_type = data.config.inputType;
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
        emitPromptEditorEvent('on_save');
    }

    const back = async () => {
        if (isChanged()) {
            modal.open(ChoiceDialog, {
                title: '작업을 저장하겠습니까?',
                choices: [
                    { text: '저장', tone: 'highlight' },
                    { text: '저장하지 않음' },
                    { text: '취소', tone: 'dimmed' },
                ],
                onSelect: async (choice: string, index: number) => {
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
                },
                onEnter: async () => {
                    await save();
                    emitNavigate('back');
                    return true;
                },
                onEscape: async () => true,

                children: <span>저장되지 않은 변경사항이 있습니다</span>,
            });
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
        modal.open(VarEditModal, {
            get: promptEditorData.get,
            action: promptEditorData.action,
        });
    }, []);
    usePromptEditorEvent('open_prompt_only_config_modal', async () => {
        modal.open(PromptOnlyConfigModal, {
            data: value,
        });
    }, []);

    // 초기 프롬프트 데이터 로드
    const load = async () => {
        if (!(rtId && promptId)) return;

        const { input_type, mode, version } = await rtState.get.metadata();
        const { name, model } = await rtState.get.promptMetadata(promptId);
        const contents = await rtState.get.promptContents(promptId);
        const vars = await rtState.get.promptVars(promptId);

        /// @TODO : 원래 model은 반드시 valid하게 와야하는데 {}만 오는 문제
        // 현재는 처리되는지 확인 필요
        const data: PromptEditorData = {
            rtId,
            promptId,
            name,
            version,
            contents,
            variables: vars.map(convertRTVarToPromptVar),
            config: {
                inputType: input_type,
            },
            flags: {
                syncRTName: true,
            },

            promptOnly: {
                enabled: true,
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
        emitPromptEditorEvent,
        usePromptEditorEvent
    }
}

export default usePromptEditor;