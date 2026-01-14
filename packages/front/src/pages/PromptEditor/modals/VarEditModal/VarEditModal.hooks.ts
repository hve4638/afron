import { useMemo, useState } from 'react';
import { useBus } from '@/lib/zustbus';
import { PromptEditorData } from '../../hooks';
import { VarEditModalControlEvent } from './types';
import { useModalInstance } from '@/features/modal';

type SecondEditorData = {
    type: 'array'
} | {
    type: 'struct'
    fieldName: string;
}

interface useVarEditModalProps {
    varId: string;

    promptEditorData: PromptEditorData;
}

export function useVarEditModal({
    varId,
    promptEditorData: {
        get,
        event: { usePromptDataUpdateOn: usePromptDataUpdateEvent },
    },
}: useVarEditModalProps) {
    const { closeModal, useCloseKeyBind } = useModalInstance();
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

    usePromptDataUpdateEvent('updated', () => {
        setPromptData(get());
    }, [get]);

    useCloseKeyBind();

    return {
        promptVar,
        emitVarEditModalControl,

        secondEditorData,
    }
}