import { useMemo, useState } from 'react';
import { useBus, useOn } from '@/lib/zustbus';
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
        event: { promptDataUpdateBus },
    },
}: useVarEditModalProps) {
    const { closeModal, useCloseKeyBind } = useModalInstance();
    const [promptData, setPromptData] = useState(() => get());
    const promptVar = useMemo(() => promptData.variables.find(v => v.id === varId)!, [varId, promptData]);

    const [secondEditorData, setSecondEditorData] = useState<SecondEditorData | null>(null);

    const varEditModalControlBus = useBus<VarEditModalControlEvent>();

    useOn(varEditModalControlBus.on.open_struct_field_editor, ({ fieldName }) => {
        setSecondEditorData({ type: 'struct', fieldName });
    }, []);

    useOn(varEditModalControlBus.on.open_array_element_editor, () => {
        setSecondEditorData({ type: 'array' });
    }, []);

    useOn(varEditModalControlBus.on.close_2rd_editor, () => {
        setSecondEditorData(null);
    }, []);

    useOn(varEditModalControlBus.on.close_modal, () => {
        closeModal();
    }, [closeModal]);

    useOn(promptDataUpdateBus.on.updated, () => {
        setPromptData(get());
    }, [get]);

    useCloseKeyBind();

    return {
        promptVar,
        emitVarEditModalControl: varEditModalControlBus.emit,

        secondEditorData,
    }
}