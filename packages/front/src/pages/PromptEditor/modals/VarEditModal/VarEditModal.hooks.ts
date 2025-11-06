import { useMemo, useState } from 'react';
import { useBus } from '@/lib/zustbus';
import { PromptEditorData } from '../../hooks';
import useModalDisappear from '@/hooks/useModalDisappear';
import useHotkey from '@/hooks/useHotkey';
import { VarEditModalControlEvent } from './types';

type SecondEditorData = {
    type: 'array'
} | {
    type: 'struct'
    fieldName: string;
}

interface useVarEditModalProps {
    varId: string;

    promptEditorData: PromptEditorData;

    closeModal: () => void;
}

export function useVarEditModal({
    varId,
    promptEditorData: {
        get,
        event: { usePromptDataUpdateOn: usePromptDataUpdateEvent },
    },
    closeModal,
}: useVarEditModalProps) {
    const [promptData, setPromptData] = useState(() => get());
    const promptVar = useMemo(() => promptData.variables.find(v => v.id === varId)!, [varId, promptData]);

    const [secondEditorData, setSecondEditorData] = useState<SecondEditorData | null>(null);

    const [emitVarEditModalControl, useVarEditModalControlOn] = useBus<VarEditModalControlEvent>();

    useVarEditModalControlOn('open_struct_field_editor', ({ fieldName }) => {
        setSecondEditorData({ type: 'struct', fieldName });
    }, []);

    useVarEditModalControlOn('open_array_element_editor', () => {
        setSecondEditorData({ type: 'array' });
    }, []);

    useVarEditModalControlOn('close_2rd_editor', () => {
        setSecondEditorData(null);
    }, []);

    useVarEditModalControlOn('close_modal', () => {
        closeModal();
    }, [closeModal]);

    useHotkey({
        'Escape': () => closeModal(),
    });

    usePromptDataUpdateEvent('updated', () => {
        setPromptData(get());
    }, [get]);

    return {
        promptVar,
        emitVarEditModalControl,

        secondEditorData,
    }
}